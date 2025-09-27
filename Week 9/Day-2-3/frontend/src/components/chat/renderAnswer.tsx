import React from "react";
import { AskResponse } from "../../utils/api";
import PaginatedChatTable from "./PaginatedChatTable";

export const renderAnswer = (answer: AskResponse): React.ReactElement => {
  if (typeof answer === "string") {
    return <p className="text-gray-700">{answer}</p>;
  }

  if (answer?.type === "text") {
    return <p className="text-gray-700">{answer.data as string}</p>;
  }

  if (
    answer?.type === "table" &&
    answer?.data &&
    typeof answer.data === "object" &&
    "rows" in answer.data
  ) {
    const tableData = answer.data as {
      columns: string[];
      rows: unknown[][];
    };
    return <PaginatedChatTable tableData={tableData} />;
  }

  if (answer?.type === "multi-format" && Array.isArray(answer?.data)) {
    return (
      <div className="space-y-4">
        {answer.data.map((formatData: unknown, idx: number) => {
          const typedFormatData = formatData as {
            format: string;
          } & AskResponse;
          return (
            <div
              key={idx}
              className="border border-gray-300 rounded-lg p-4 transition-all duration-300 bg-gradient-to-r from-white to-gray-50/50 hover:from-gray-50 hover:to-white"
            >
              <h4 className="font-semibold mb-2 text-blue-600 flex items-center gap-2">
                <span className="text-lg transition-transform duration-200 hover:scale-125 ">
                  {typedFormatData.format === "Test" && "🏐"}
                  {typedFormatData.format === "ODI" && "🏐"}
                  {typedFormatData.format === "T20" && "🏐"}
                  {typedFormatData.format === "Unknown" && "🏐"}
                </span>
                {typedFormatData.format} Cricket
              </h4>
              {renderAnswer(typedFormatData)}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <pre className="text-sm bg-gray-100 p-2 rounded ">
      {JSON.stringify(answer, null, 2)}
    </pre>
  );
};
