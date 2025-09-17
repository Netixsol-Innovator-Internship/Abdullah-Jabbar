import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
}) as unknown as React.ComponentType<Record<string, unknown>>;

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function RichEditorField({
  value,
  onChange,
  placeholder,
}: Props) {
  const quillProps: Record<string, unknown> = {
    theme: "snow",
    value,
    onChange,
    placeholder,
    className: "rounded-lg border border-gray-200",
  };

  return React.createElement(ReactQuill, quillProps);
}
