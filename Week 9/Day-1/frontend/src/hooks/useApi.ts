import useSWR from "swr";
import { workflowApi } from "@/lib/api";
import { Trace, Question } from "@/types";

export const useTrace = (traceId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    traceId ? `/trace/${traceId}` : null,
    () => workflowApi.getTrace(traceId!),
    {
      refreshInterval: 2000, // Refresh every 2 seconds for live updates
      revalidateOnFocus: true,
    }
  );

  return {
    trace: data as Trace | undefined,
    isLoading,
    error,
    mutate,
  };
};

export const useQuestions = () => {
  // TODO: Replace with actual API call when questions endpoint is available
  // For now, return empty data to prevent the page from breaking
  return {
    questions: [] as Question[],
    isLoading: false,
    error: null,
    mutate: () => {},
  };
};
