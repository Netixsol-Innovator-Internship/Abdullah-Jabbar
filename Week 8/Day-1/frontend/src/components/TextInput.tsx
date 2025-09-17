import React from "react";

type Props = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
};

export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: Props) {
  return (
    <div>
      {label && (
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 ${className}`}
      />
    </div>
  );
}
