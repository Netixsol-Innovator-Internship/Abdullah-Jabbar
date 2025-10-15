"use client";

import { useState, useEffect } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useChainId,
} from "wagmi";
import { TaskList } from "./TaskList";
import { AddTaskForm } from "./AddTaskForm";
import { TaskStats } from "./TaskStats";
import { TaskFilters } from "./TaskFilters";
import { LoadingSpinner } from "./LoadingSpinner";
import { CONTRACT_CONFIG } from "../lib/config";
import toast from "react-hot-toast";

// Contract configuration
const CONTRACT_ADDRESS = CONTRACT_CONFIG.address;
const TODO_LIST_ABI = CONTRACT_CONFIG.abi;
export interface Task {
  content: string;
  isCompleted: boolean;
  createdAt: number;
  priority: number;
  category: string;
  id?: number;
}

interface TodoAppProps {
  userAddress: string;
}

// Demo mode tasks for testing UI (moved outside component to avoid dependency issues)
const DEMO_TASKS: Task[] = [
  {
    id: 0,
    content: "Deploy TodoList Smart Contract",
    isCompleted: false,
    createdAt: Date.now() / 1000,
    priority: 5,
    category: "Blockchain",
  },
  {
    id: 1,
    content: "Update CONTRACT_ADDRESS in frontend",
    isCompleted: false,
    createdAt: Date.now() / 1000,
    priority: 4,
    category: "Development",
  },
  {
    id: 2,
    content: "Test wallet connection",
    isCompleted: true,
    createdAt: Date.now() / 1000,
    priority: 3,
    category: "Testing",
  },
];

export function TodoApp({ userAddress }: TodoAppProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [demoMode] = useState(false);

  // Get current account and chain info for debugging
  const { address: connectedAddress, isConnected } = useAccount();
  const chainId = useChainId();

  // Read task count using connected address (more reliable)
  const { data: taskCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TODO_LIST_ABI,
    functionName: "taskCounts",
    args: [connectedAddress as `0x${string}`],
    query: {
      enabled: !!CONTRACT_ADDRESS && !!connectedAddress && isConnected,
    },
  });

  // Try to get a specific task if count > 0
  const { data: firstTask } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TODO_LIST_ABI,
    functionName: "getTask",
    args: [BigInt(0)],
    account: connectedAddress,
    query: {
      enabled:
        !!CONTRACT_ADDRESS &&
        taskCount !== undefined &&
        Number(taskCount) > 0 &&
        isConnected &&
        !!connectedAddress,
    },
  });

  // Alternative approach: try getting tasks by status (pending + completed)
  const { data: pendingTasksData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TODO_LIST_ABI,
    functionName: "getTasksByStatus",
    args: [false], // pending tasks
    account: connectedAddress,
    query: {
      enabled: !!CONTRACT_ADDRESS && isConnected && !!connectedAddress,
    },
  });

  const { data: completedTasksData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TODO_LIST_ABI,
    functionName: "getTasksByStatus",
    args: [true], // completed tasks
    account: connectedAddress,
    query: {
      enabled: !!CONTRACT_ADDRESS && isConnected && !!connectedAddress,
    },
  });

  // Read all tasks - uses msg.sender so it should use connected wallet
  const {
    data: allTasksData,
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
    error: tasksError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TODO_LIST_ABI,
    functionName: "getAllTasks",
    account: connectedAddress,
    query: {
      enabled: !!CONTRACT_ADDRESS && isConnected && !!connectedAddress,
    },
  });

  // Read task statistics
  const { data: statsData, refetch: refetchStats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TODO_LIST_ABI,
    functionName: "getTaskStats",
    account: connectedAddress,
    query: {
      enabled: !!CONTRACT_ADDRESS && isConnected && !!connectedAddress,
    },
  });

  console.log("=== DEBUGGING INFO ===");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("User Address (prop):", userAddress);
  console.log("Connected Address:", connectedAddress);
  console.log("Is Connected:", isConnected);
  console.log("Chain ID:", chainId);
  console.log("Address Match:", userAddress === connectedAddress);
  console.log(
    "Address Match (lower):",
    userAddress?.toLowerCase() === connectedAddress?.toLowerCase(),
  );
  console.log("\n=== CONTRACT DATA ===");
  console.log("Task Count:", taskCount);
  console.log("First Task:", firstTask);
  console.log("All Tasks Data:", allTasksData);
  console.log("Pending Tasks Data:", pendingTasksData);
  console.log("Completed Tasks Data:", completedTasksData);
  console.log("Tasks Error:", tasksError);
  console.log("Stats Data:", statsData);

  // Convert BigInt values for display
  if (taskCount) {
    console.log("\n=== CONVERTED VALUES ===");
    console.log("Task Count (Number):", Number(taskCount));
  }
  if (statsData) {
    console.log("Stats Data (Numbers):", [
      Number(statsData[0]),
      Number(statsData[1]),
      Number(statsData[2]),
    ]);
  }

  // Additional debugging for account mismatch
  console.log("\n=== ACCOUNT DEBUG ===");
  console.log("Account used for calls:", connectedAddress);
  console.log("Account type:", typeof connectedAddress);
  console.log(
    "Account valid:",
    !!connectedAddress &&
      connectedAddress !== "0x0000000000000000000000000000000000000000",
  );
  // Write contract hook
  const {
    writeContract,
    data: writeData,
    isPending: isWritePending,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isTransactionError,
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction confirmed!");
      refetchTasks();
      refetchStats();
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [isConfirmed, refetchTasks, refetchStats, setRefreshTrigger]);

  // Handle transaction error
  useEffect(() => {
    if (isTransactionError) {
      toast.error("Transaction failed!");
    }
  }, [isTransactionError]);

  // Process tasks data or use demo data
  useEffect(() => {
    if (demoMode) {
      setTasks(DEMO_TASKS);
      setIsLoading(false);
      return;
    }

    // Primary method: Use getAllTasks
    if (allTasksData !== undefined && allTasksData !== null) {
      console.log("=== Processing getAllTasks data ===");
      console.log("Raw allTasksData:", allTasksData);
      console.log("Type:", typeof allTasksData);
      console.log("Is Array:", Array.isArray(allTasksData));

      try {
        // Wagmi returns struct arrays as arrays of objects or array-like objects
        let tasksToProcess: unknown[] = [];

        if (Array.isArray(allTasksData)) {
          // Direct array
          tasksToProcess = allTasksData;
          console.log("Direct array, length:", allTasksData.length);
        } else if (typeof allTasksData === "object") {
          // Array-like object (has numeric keys)
          const keys = Object.keys(allTasksData);
          console.log("Object keys:", keys);

          // Check if it's array-like (has numeric indices)
          const numericKeys = keys
            .filter((k) => /^\d+$/.test(k))
            .map(Number)
            .sort((a, b) => a - b);
          if (numericKeys.length > 0) {
            console.log("Array-like object with indices:", numericKeys);
            tasksToProcess = numericKeys.map(
              (i) => (allTasksData as Record<number, unknown>)[i],
            );
          }
        }

        if (tasksToProcess.length > 0) {
          console.log("Processing", tasksToProcess.length, "tasks");
          const processedTasks = processTaskArray(tasksToProcess);
          console.log("Successfully processed tasks:", processedTasks);

          if (processedTasks.length > 0) {
            setTasks(processedTasks);
            setIsLoading(false);
            return;
          }
        } else {
          console.log("No tasks found in allTasksData");
          // If allTasksData exists but is empty, set empty array
          if (
            Array.isArray(allTasksData) ||
            (typeof allTasksData === "object" &&
              Object.keys(allTasksData).length === 0)
          ) {
            setTasks([]);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error processing getAllTasks:", error);
      }
    }

    // Fallback: try to combine pending and completed tasks
    if (pendingTasksData || completedTasksData) {
      console.log("=== Fallback: Processing getTasksByStatus data ===");
      console.log("Pending tasks data:", pendingTasksData);
      console.log("Completed tasks data:", completedTasksData);

      try {
        const allTasksWithIds: Array<{ task: unknown; id: number }> = [];

        // Process pending tasks
        // getTasksByStatus returns [Task[], uint256[]] tuple
        if (
          pendingTasksData &&
          Array.isArray(pendingTasksData) &&
          pendingTasksData.length >= 2
        ) {
          const [pendingTasks, pendingIds] = pendingTasksData;
          console.log("Pending tasks array:", pendingTasks);
          console.log("Pending IDs array:", pendingIds);

          if (Array.isArray(pendingTasks) && Array.isArray(pendingIds)) {
            pendingTasks.forEach((task, idx) => {
              const taskId = pendingIds[idx] ? Number(pendingIds[idx]) : idx;
              allTasksWithIds.push({ task, id: taskId });
            });
          }
        }

        // Process completed tasks
        if (
          completedTasksData &&
          Array.isArray(completedTasksData) &&
          completedTasksData.length >= 2
        ) {
          const [completedTasks, completedIds] = completedTasksData;
          console.log("Completed tasks array:", completedTasks);
          console.log("Completed IDs array:", completedIds);

          if (Array.isArray(completedTasks) && Array.isArray(completedIds)) {
            completedTasks.forEach((task, idx) => {
              const taskId = completedIds[idx]
                ? Number(completedIds[idx])
                : idx;
              allTasksWithIds.push({ task, id: taskId });
            });
          }
        }

        if (allTasksWithIds.length > 0) {
          const processedTasks = processTaskArrayWithIds(allTasksWithIds);
          console.log("Processed tasks from getTasksByStatus:", processedTasks);
          setTasks(processedTasks);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error processing getTasksByStatus data:", error);
      }
    }

    // If we reach here, no tasks were found
    console.log("No tasks found - checking why...");
    console.log("allTasksData:", allTasksData);
    console.log("pendingTasksData:", pendingTasksData);
    console.log("completedTasksData:", completedTasksData);
    console.log("isConnected:", isConnected);
    console.log("connectedAddress:", connectedAddress);
    console.log("userAddress:", userAddress);
    console.log("taskCount:", taskCount);
    setTasks([]);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allTasksData,
    pendingTasksData,
    completedTasksData,
    refreshTrigger,
    demoMode,
    isConnected,
    connectedAddress,
    taskCount,
    userAddress,
  ]);

  // Helper function to process a single task
  const processTask = (task: unknown, id: number): Task | null => {
    console.log(`\n--- Processing task ${id} ---`);
    console.log(`Raw task:`, task);
    console.log(`Type:`, typeof task);
    console.log(`Is array:`, Array.isArray(task));

    if (!task) {
      console.warn(`Task ${id} is null or undefined`);
      return null;
    }

    let content: string = "";
    let isCompleted: boolean = false;
    let createdAt: number | bigint = 0;
    let priority: number | bigint = 3;
    let category: string | bigint =
      "0x0000000000000000000000000000000000000000000000000000000000000000";

    try {
      // Wagmi/viem returns Solidity structs as objects with both named and indexed properties
      // Example: { 0: "content", 1: false, 2: 123456, 3: 3, 4: "0x...", content: "content", isCompleted: false, ... }

      if (typeof task === "object" && !Array.isArray(task)) {
        const taskObj = task as Record<string | number, unknown>;
        const keys = Object.keys(taskObj);
        console.log(`Object keys:`, keys);
        console.log(
          `Object values:`,
          Object.values(taskObj).map((v) =>
            typeof v === "bigint" ? v.toString() : v,
          ),
        );

        // Try named properties first (more reliable)
        if ("content" in taskObj) {
          content = taskObj.content as string;
          isCompleted = (taskObj.isCompleted as boolean) ?? false;
          createdAt = (taskObj.createdAt as number | bigint) ?? 0;
          priority = (taskObj.priority as number | bigint) ?? 3;
          category =
            (taskObj.category as string | bigint) ??
            "0x0000000000000000000000000000000000000000000000000000000000000000";
          console.log("Using named properties");
        }
        // Fallback to indexed properties
        else if (0 in taskObj || "0" in taskObj) {
          content = (taskObj[0] ?? taskObj["0"]) as string;
          isCompleted = ((taskObj[1] ?? taskObj["1"]) as boolean) ?? false;
          createdAt = ((taskObj[2] ?? taskObj["2"]) as number | bigint) ?? 0;
          priority = ((taskObj[3] ?? taskObj["3"]) as number | bigint) ?? 3;
          category =
            ((taskObj[4] ?? taskObj["4"]) as string | bigint) ??
            "0x0000000000000000000000000000000000000000000000000000000000000000";
          console.log("Using indexed properties");
        } else {
          console.warn(`Task ${id} has unexpected object structure:`, keys);
          return null;
        }
      }
      // Handle array/tuple format
      else if (Array.isArray(task) && task.length >= 5) {
        [content, isCompleted, createdAt, priority, category] = task;
        console.log("Using array destructuring");
      }
      // Invalid format
      else {
        console.warn(`Task ${id} has invalid format`);
        return null;
      }
    } catch (error) {
      console.error(`Error extracting task ${id} properties:`, error);
      return null;
    }

    // Validate content
    console.log(`Extracted values:`, {
      content,
      isCompleted,
      createdAt,
      priority,
      category,
    });

    if (typeof content !== "string") {
      console.warn(
        `Task ${id} content is not a string:`,
        typeof content,
        content,
      );
      return null;
    }

    if (content.trim() === "") {
      console.warn(`Task ${id} has empty content`);
      return null;
    }

    // Convert category from bytes32 to string
    const categoryString = (() => {
      try {
        const categoryStr = category?.toString() || "";
        console.log(`Converting category for task ${id}:`, categoryStr);

        if (
          !categoryStr ||
          categoryStr ===
            "0x0000000000000000000000000000000000000000000000000000000000000000" ||
          categoryStr === "0x0"
        ) {
          return "General";
        }

        // Remove '0x' prefix
        const hex = categoryStr.replace("0x", "");
        if (hex.length === 0) return "General";

        let result = "";

        // Convert hex pairs to characters
        for (let i = 0; i < hex.length; i += 2) {
          const hexPair = hex.substring(i, i + 2);
          const charCode = parseInt(hexPair, 16);
          if (charCode === 0 || isNaN(charCode)) break; // Stop at null terminator or invalid
          if (charCode >= 32 && charCode <= 126) {
            // Only printable ASCII
            result += String.fromCharCode(charCode);
          }
        }

        const finalCategory = result.trim() || "General";
        console.log(`Converted category:`, finalCategory);
        return finalCategory;
      } catch (e) {
        console.warn(`Error converting category for task ${id}:`, e);
        return "General";
      }
    })();

    const processedTask = {
      id: id,
      content: content.trim(),
      isCompleted: Boolean(isCompleted),
      createdAt: Number(createdAt),
      priority: Number(priority),
      category: categoryString,
    };

    console.log(`Successfully processed task ${id}:`, processedTask);
    return processedTask;
  };

  // Helper function to process task arrays with explicit IDs
  const processTaskArrayWithIds = (
    taskArray: Array<{ task: unknown; id: number }>,
  ) => {
    return taskArray
      .map(({ task, id }) => {
        console.log(`Processing task with ID ${id}:`, task);
        return processTask(task, id);
      })
      .filter((task): task is NonNullable<typeof task> => task !== null);
  };

  // Helper function to process task arrays
  const processTaskArray = (taskArray: unknown[]) => {
    return taskArray
      .map((task: unknown, index: number) => {
        console.log(`Processing task ${index}:`, task);
        return processTask(task, index);
      })
      .filter((task): task is NonNullable<typeof task> => task !== null);
  };

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.isCompleted;
    if (filter === "completed") return task.isCompleted;
    return true;
  });

  // Handle create task (demo mode or real contract)
  const handleCreateTask = (
    content: string,
    priority: number,
    category: string,
  ) => {
    if (demoMode) {
      const newTask: Task = {
        id: tasks.length,
        content,
        isCompleted: false,
        createdAt: Date.now() / 1000,
        priority,
        category,
      };
      setTasks((prev) => [...prev, newTask]);
      toast.success("Demo task created! (Contract not deployed)");
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: TODO_LIST_ABI,
        functionName: "createTask",
        args: [content, priority, category],
      });
      toast.loading("Creating task...");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  // Handle toggle task (demo mode or real contract)
  const handleToggleTask = (taskId: number) => {
    if (demoMode) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, isCompleted: !task.isCompleted }
            : task,
        ),
      );
      toast.success("Demo task toggled!");
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: TODO_LIST_ABI,
        functionName: "toggleTask",
        args: [BigInt(taskId)],
      });
      toast.loading("Toggling task...");
    } catch (error) {
      console.error("Error toggling task:", error);
      toast.error("Failed to toggle task");
    }
  };

  // Handle update task (demo mode or real contract)
  // Currently unused but kept for future task editing functionality
  // const handleUpdateTask = (taskId: number, newContent: string) => {
  //   if (demoMode) {
  //     setTasks((prev) =>
  //       prev.map((task) =>
  //         task.id === taskId ? { ...task, content: newContent } : task,
  //       ),
  //     );
  //     toast.success("Demo task updated!");
  //     return;
  //   }

  //   try {
  //     writeContract({
  //       address: CONTRACT_ADDRESS,
  //       abi: TODO_LIST_ABI,
  //       functionName: "updateTask",
  //       args: [BigInt(taskId), newContent],
  //     });
  //     toast.loading("Updating task...");
  //   } catch (error) {
  //     console.error("Error updating task:", error);
  //     toast.error("Failed to update task");
  //   }
  // };

  // Handle delete task (demo mode or real contract)
  const handleDeleteTask = (taskId: number) => {
    if (demoMode) {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      toast.success("Demo task deleted!");
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: TODO_LIST_ABI,
        functionName: "deleteTask",
        args: [BigInt(taskId)],
      });
      toast.loading("Deleting task...");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  // Calculate statistics for demo mode
  const getTaskStats = () => {
    if (demoMode) {
      const total = tasks.length;
      const completed = tasks.filter((task) => task.isCompleted).length;
      const pending = total - completed;
      return [total, completed, pending];
    }
    return statsData
      ? [Number(statsData[0]), Number(statsData[1]), Number(statsData[2])]
      : [0, 0, 0];
  };

  if (isLoading || (!demoMode && isLoadingTasks)) {
    return <LoadingSpinner />;
  }

  // Check if contract address is set
  if (CONTRACT_ADDRESS === "0x...") {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Contract Not Deployed
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Please deploy the TodoList smart contract and update the
          CONTRACT_ADDRESS in the code.
        </p>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg max-w-lg mx-auto">
          <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">
            Update CONTRACT_ADDRESS in: app/components/TodoApp.tsx
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Panel */}
      {/* <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Debug Information
        </h3>
        <div className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
          <div>Contract: {CONTRACT_ADDRESS}</div>
          <div>Connected: {connectedAddress}</div>
          <div>Chain ID: {chainId}</div>
          <div>Task Count: {taskCount ? Number(taskCount) : "Loading..."}</div>
          <div>Has Tasks Data: {allTasksData ? "Yes" : "No"}</div>
          <div>
            Tasks Array Length: {allTasksData ? allTasksData.length : "N/A"}
          </div>
        </div>
        <button
          onClick={() => {
            console.log("Manual refresh triggered");
            refetchTasks();
            refetchStats();
            setRefreshTrigger((prev) => prev + 1);
          }}
          className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          Force Refresh
        </button>
      </div> */}

      {/* Demo Mode Indicator */}
      {demoMode && (
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="text-yellow-600 dark:text-yellow-400 text-lg">
              ⚠️
            </div>
            <div>
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                Demo Mode - Contract Not Deployed
              </h3>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                You&apos;re seeing demo functionality. Deploy the contract and
                update CONTRACT_ADDRESS to enable blockchain features.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Task Statistics */}
      <TaskStats
        stats={(() => {
          const [total, completed, pending] = getTaskStats();
          return { total, completed, pending };
        })()}
      />

      {/* Add Task Form */}
      <AddTaskForm
        onCreateTask={handleCreateTask}
        isLoading={(!demoMode && isWritePending) || (!demoMode && isConfirming)}
      />

      {/* Task Filters */}
      <TaskFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        taskCounts={{
          all: tasks.length,
          pending: tasks.filter((t) => !t.isCompleted).length,
          completed: tasks.filter((t) => t.isCompleted).length,
        }}
      />

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        isLoading={(!demoMode && isWritePending) || (!demoMode && isConfirming)}
      />

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">
            {filter === "completed" ? "🎉" : filter === "pending" ? "📝" : "📋"}
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {filter === "completed"
              ? "No completed tasks yet"
              : filter === "pending"
                ? "No pending tasks"
                : "No tasks yet"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filter === "all"
              ? "Create your first task to get started!"
              : `Switch to a different filter to see your ${filter === "completed" ? "pending" : "completed"} tasks.`}
          </p>
        </div>
      )}
    </div>
  );
}
