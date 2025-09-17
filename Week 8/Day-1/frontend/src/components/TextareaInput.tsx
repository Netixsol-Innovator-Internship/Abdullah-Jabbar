import React from "react";

type Props = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
};

export default function TextareaInput({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: Props) {
  return (
    <div>
      {label && (
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
      />
    </div>
  );
}
