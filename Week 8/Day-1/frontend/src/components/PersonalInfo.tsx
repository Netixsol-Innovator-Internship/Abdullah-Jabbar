import React from "react";
import { CVFields } from "../types/cv";
import TextInput from "./TextInput";
import RichEditorField from "./RichEditorField";

type Props = {
  fields: CVFields;
  onFieldChange: (field: keyof CVFields, value: string) => void;
  errors?: Record<string, string>;
};

export default function PersonalInfo({
  fields,
  onFieldChange,
  errors = {},
}: Props) {
  return (
    <>
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Full name
          {errors.fullName && (
            <span className="text-red-500 text-xs ml-2">{errors.fullName}</span>
          )}
        </label>
        <TextInput
          value={fields.fullName}
          onChange={(v) => onFieldChange("fullName", v)}
          placeholder="Jane Doe"
        />
      </div>

      <div className="mt-3">
        <label className="block mb-1 font-medium text-gray-700">
          Job title
          {errors.jobTitle && (
            <span className="text-red-500 text-xs ml-2">{errors.jobTitle}</span>
          )}
        </label>
        <TextInput
          value={fields.jobTitle}
          onChange={(v) => onFieldChange("jobTitle", v)}
          placeholder="Frontend Engineer"
        />
      </div>

      <div className="mt-3">
        <label className="block mb-1 font-medium text-gray-700">
          Summary
          {errors.summary && (
            <span className="text-red-500 text-xs ml-2">{errors.summary}</span>
          )}
        </label>
        <RichEditorField
          value={fields.summary}
          onChange={(v) => onFieldChange("summary", v)}
          placeholder="Product-focused front-end engineer with 5+ years..."
        />
      </div>
    </>
  );
}
