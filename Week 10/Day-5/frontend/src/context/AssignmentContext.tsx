"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { parseStudentFromFilename } from "@/lib/parseStudent";
import * as api from "@/lib/api";

type EvaluationMode = "strict" | "loose";

export type Submission = {
  id: string;
  file: File | null; // null when loaded from API
  studentName: string | null;
  rollNo: string | null;
  status: "pending" | "processing" | "done" | "failed";
  score?: number;
  remarks?: string;
  fileName?: string;
};

type Assignment = {
  title: string;
  instructions: string;
  mode: EvaluationMode;
  wordCount?: number;
};

type HistoryEntry = {
  id: string;
  title: string;
  createdAt: number;
  status: "pending" | "completed";
};

type Ctx = {
  assignment: Assignment;
  setAssignment: (a: Assignment) => void;
  currentAssignmentId: string | null;

  submissions: Submission[];
  addSubmissions: (files: File[]) => void;
  removeSubmission: (id: string) => void;
  startEvaluation: () => Promise<void>;

  history: HistoryEntry[];
  addHistoryEntry: (entry: {
    title: string;
    status: "pending" | "completed";
  }) => void;

  isLoading: boolean;
  error: string | null;
};

const AssignmentContext = createContext<Ctx | null>(null);

export function AssignmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [assignment, setAssignmentState] = useState<Assignment>({
    title: "",
    instructions: "",
    mode: "strict",
    wordCount: 500,
  });

  const [currentAssignmentId, setCurrentAssignmentId] = useState<string | null>(
    null
  );
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentHistoryIdRef = useRef<string | null>(null);
  const pollingRef = useRef<boolean>(false);

  // Load assignments history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const assignments = await api.getAssignments();
        if (!Array.isArray(assignments)) {
          console.warn("getAssignments returned non-array:", assignments);
          setHistory([]);
          return;
        }

        const historyEntries: HistoryEntry[] = assignments.map((a) => ({
          id: a._id,
          title: a.topic,
          createdAt: new Date(a.createdAt).getTime(),
          status: "completed" as const, // Assume completed if it exists
        }));
        setHistory(historyEntries);
      } catch (err) {
        console.error("Failed to load history:", err);
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      }
    };
    loadHistory();
  }, []);

  const setAssignment = useCallback((a: Assignment) => {
    setAssignmentState(a);
    setError(null);
  }, []);

  const addHistoryEntry = useCallback(
    (entry: { title: string; status: "pending" | "completed" }) => {
      const id = crypto.randomUUID();
      currentHistoryIdRef.current = id;
      setHistory((prev) => [
        { id, title: entry.title, status: entry.status, createdAt: Date.now() },
        ...prev,
      ]);
    },
    []
  );

  const markHistoryCompleted = useCallback(() => {
    const id = currentHistoryIdRef.current;
    if (!id) return;
    setHistory((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status: "completed" } : h))
    );
  }, []);

  const addSubmissions = useCallback((files: File[]) => {
    setSubmissions((prev) => {
      const items: Submission[] = files.map((file) => {
        const { name, rollNo } = parseStudentFromFilename(file.name);
        return {
          id: crypto.randomUUID(),
          file,
          studentName: name,
          rollNo,
          status: "pending",
          fileName: file.name,
        };
      });
      return [...prev, ...items];
    });
    setError(null);
  }, []);

  const removeSubmission = useCallback((id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const startEvaluation = useCallback(async () => {
    if (!assignment.title || submissions.length === 0) {
      setError("Assignment title and submissions are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Create assignment in backend
      const createdAssignment = await api.createAssignment({
        topic: assignment.title,
        instructions: assignment.instructions,
        wordCount: assignment.wordCount,
        mode: assignment.mode,
      });

      setCurrentAssignmentId(createdAssignment._id);

      // Update history with the actual backend ID
      setHistory((prev) =>
        prev.map((h) =>
          h.id === currentHistoryIdRef.current
            ? { ...h, id: createdAssignment._id }
            : h
        )
      );
      currentHistoryIdRef.current = createdAssignment._id;

      // Step 2: Upload all submission files
      const filesToUpload = submissions
        .filter((s) => s.file !== null)
        .map((s) => s.file!);

      if (filesToUpload.length > 0) {
        const uploadedSubmissions = await api.uploadSubmissions(
          createdAssignment._id,
          filesToUpload
        );

        // Update local submissions with backend IDs
        setSubmissions((prev) =>
          prev.map((localSub, index) => {
            const backendSub = uploadedSubmissions[index];
            if (backendSub) {
              return {
                ...localSub,
                id: backendSub._id,
                status: "processing" as const,
                studentName: backendSub.studentName || localSub.studentName,
                rollNo: backendSub.rollNumber || localSub.rollNo,
              };
            }
            return localSub;
          })
        );
      }

      // Step 3: Start evaluation
      await api.evaluateAssignment(createdAssignment._id);

      // Step 4: Start polling for results
      pollingRef.current = true;

      api.pollSubmissions(
        createdAssignment._id,
        2000,
        (backendSubmissions) => {
          setSubmissions((prev) => {
            return prev.map((localSub) => {
              const backendSub = backendSubmissions.find(
                (bs) => bs._id === localSub.id
              );

              if (backendSub) {
                return {
                  ...localSub,
                  status:
                    backendSub.status === "evaluated"
                      ? "done"
                      : backendSub.status === "failed"
                        ? "failed"
                        : "processing",
                  score: backendSub.score,
                  remarks: backendSub.feedback,
                };
              }
              return localSub;
            });
          });

          // Check if all are done
          const allDone = backendSubmissions.every(
            (s) => s.status === "evaluated" || s.status === "failed"
          );

          if (allDone) {
            markHistoryCompleted();
            pollingRef.current = false;
          }
        },
        () => pollingRef.current
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to evaluate assignment";
      setError(errorMessage);
      console.error("Evaluation error:", err);

      // Mark submissions as failed
      setSubmissions((prev) =>
        prev.map((s) => ({ ...s, status: "failed" as const }))
      );
    } finally {
      setIsLoading(false);
    }
  }, [assignment, submissions, markHistoryCompleted]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      pollingRef.current = false;
    };
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      assignment,
      setAssignment,
      currentAssignmentId,

      submissions,
      addSubmissions,
      removeSubmission,
      startEvaluation,

      history,
      addHistoryEntry,

      isLoading,
      error,
    }),
    [
      assignment,
      setAssignment,
      currentAssignmentId,
      submissions,
      addSubmissions,
      removeSubmission,
      startEvaluation,
      history,
      addHistoryEntry,
      isLoading,
      error,
    ]
  );

  return (
    <AssignmentContext.Provider value={value}>
      {children}
    </AssignmentContext.Provider>
  );
}

export function useAssignment() {
  const ctx = useContext(AssignmentContext);
  if (!ctx)
    throw new Error("useAssignment must be used within AssignmentProvider");
  return ctx;
}
