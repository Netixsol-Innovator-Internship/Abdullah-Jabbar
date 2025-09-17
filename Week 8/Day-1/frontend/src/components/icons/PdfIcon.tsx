import React from "react";

export const PdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={20}
    height={20}
    aria-hidden="true"
    {...props}
  >
    {/* Document outline with folded corner */}
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    {/* Small print lines */}
    <path d="M8 13h8" />
    <path d="M8 16h6" />
  </svg>
);

export default PdfIcon;
