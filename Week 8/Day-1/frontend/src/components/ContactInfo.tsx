import React from "react";
import { CVFields } from "../types/cv";
import TextInput from "./TextInput";

type Props = {
  fields: CVFields;
  onFieldChange: (field: keyof CVFields, value: string) => void;
};

export default function ContactInfo({ fields, onFieldChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <TextInput
        label="Email"
        value={fields.email}
        onChange={(v) => onFieldChange("email", v)}
        placeholder="jane@example.com"
      />
      <TextInput
        label="Phone"
        value={fields.phone}
        onChange={(v) => onFieldChange("phone", v)}
        placeholder="+1 555 123 4567"
      />
      <TextInput
        label="Website"
        value={fields.website}
        onChange={(v) => onFieldChange("website", v)}
        placeholder="https://example.com"
      />
      <TextInput
        label="LinkedIn"
        value={fields.linkedin}
        onChange={(v) => onFieldChange("linkedin", v)}
        placeholder="https://linkedin.com/in/username"
      />
    </div>
  );
}
