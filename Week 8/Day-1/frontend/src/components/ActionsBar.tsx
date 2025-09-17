import React from "react";
import { motion } from "framer-motion";
import { TrashIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import PdfIcon from "./icons/PdfIcon";

type Props = {
  loadingPdf: boolean;
  loadingDocx: boolean;
  onGenerate: () => void;
  onDownloadDocx: () => void;
  onClear: () => void;
};

const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.2 } },
  tap: { scale: 0.9 },
};

// Spinner component
const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function ActionsBar({
  loadingPdf,
  loadingDocx,
  onGenerate,
  onDownloadDocx,
  onClear,
}: Props) {
  return (
    <motion.div className="flex flex-col sm:flex-row gap-3 mt-4 mb-0 justify-between items-center">
      <div className="flex gap-3">
        <motion.button
          type="button"
          onClick={onGenerate}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-200 px-6 py-2 rounded-lg font-semibold shadow flex items-center gap-2 cursor-pointer border border-blue-200 dark:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loadingPdf}
          variants={buttonVariants}
          whileHover={loadingPdf ? {} : "hover"}
          whileTap={loadingPdf ? {} : "tap"}
        >
          {loadingPdf ? (
            <Spinner className="w-5 h-5" />
          ) : (
            <PdfIcon className="w-5 h-5" />
          )}
          PDF
        </motion.button>
        <motion.button
          type="button"
          onClick={onDownloadDocx}
          className="bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-200 px-6 py-2 rounded-lg font-semibold shadow flex items-center gap-2 cursor-pointer border border-green-200 dark:border-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loadingDocx}
          variants={buttonVariants}
          whileHover={loadingDocx ? {} : "hover"}
          whileTap={loadingDocx ? {} : "tap"}
        >
          {loadingDocx ? (
            <Spinner className="w-5 h-5" />
          ) : (
            <DocumentTextIcon
              className="w-5 h-5 text-green-600 dark:text-green-200"
              aria-hidden="true"
            />
          )}
          Word (.docx)
        </motion.button>
      </div>

      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={onClear}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-semibold shadow flex items-center gap-2 cursor-pointer border border-red-200"
        >
          <TrashIcon className="w-5 h-5 text-red-600" aria-hidden="true" />
          Clear
        </button>
      </div>
    </motion.div>
  );
}
