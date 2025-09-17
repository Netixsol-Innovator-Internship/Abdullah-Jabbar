"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import PersonalInfo from "./PersonalInfo";
import RichEditorField from "./RichEditorField";
import SkillsInput from "./SkillsInput";
import ActionsBar from "./ActionsBar";
import { CVFields } from "../types/cv";

interface CVFormProps {
  fields: CVFields;
  onFieldChange: (field: keyof CVFields, value: string) => void;
  loadingPdf: boolean;
  loadingDocx: boolean;
  onGenerate: () => void;
  onDownloadDocx: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

function CVForm({
  fields,
  onFieldChange,
  loadingPdf,
  loadingDocx,
  onGenerate,
  onDownloadDocx,
}: CVFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFieldLength = (field: keyof CVFields, value: string) => {
    const maxLengths: Record<string, number> = {
      fullName: 32,
      email: 100,
      phone: 15,
      jobTitle: 50,
    };

    if (value.length > (maxLengths[field] || Infinity)) {
      setErrors((prev) => ({
        ...prev,
        [field]: `${field} cannot exceed ${maxLengths[field]} characters.`,
      }));
    } else {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[field];
        return updatedErrors;
      });
    }
  };

  const handleFieldChange = (field: keyof CVFields, value: string) => {
    // Only sanitize input for jobTitle
    const sanitizedValue =
      field === "jobTitle" ? value.replace(/<[^>]*>/g, "") : value;

    // Avoid unnecessary state updates
    if (fields[field] !== sanitizedValue) {
      validateFieldLength(field, sanitizedValue);
      onFieldChange(field, sanitizedValue);
    }
  };

  // Note: required-field validation removed so users can generate files anytime.

  const handleGenerate = () => {
    // Allow users to generate PDF at any time without being blocked by required-field validation
    onGenerate();
  };

  return (
    <motion.main
      className="md:col-span-5 col-span-1 bg-white pt-4 px-4 pb-2 sm:pt-6 sm:px-6 sm:pb-4 rounded-xl shadow-lg text-black"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-2xl font-bold mb-6 text-blue-700"
        variants={itemVariants}
      >
        CV Data
      </motion.h2>
      <form className="space-y-4 mb-0">
        <motion.div variants={itemVariants}>
          <PersonalInfo
            fields={fields}
            onFieldChange={handleFieldChange}
            errors={errors}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <label className="block mb-1 font-medium text-gray-700">
            Experience
          </label>
          <RichEditorField
            value={fields.experienceHtml}
            onChange={(v) => handleFieldChange("experienceHtml", v)}
            placeholder="e.g. Led frontend migrations. Built reusable components."
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block mb-1 font-medium text-gray-700">
            Education
          </label>
          <RichEditorField
            value={fields.educationHtml}
            onChange={(v) => handleFieldChange("educationHtml", v)}
            placeholder="e.g. B.Sc. Computer Science — University X (2020)"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <label className="block mb-1 font-medium text-gray-700">
            Projects
          </label>
          <RichEditorField
            value={fields.projectsHtml}
            onChange={(v) => handleFieldChange("projectsHtml", v)}
            placeholder="Project title — short description"
          />
        </motion.div>
        <SkillsInput fields={fields} onFieldChange={handleFieldChange} />
        <ActionsBar
          loadingPdf={loadingPdf}
          loadingDocx={loadingDocx}
          onGenerate={handleGenerate}
          onDownloadDocx={onDownloadDocx}
          onClear={() => {
            onFieldChange("fullName", "");
            onFieldChange("jobTitle", "");
            onFieldChange("email", "");
            onFieldChange("phone", "");
            onFieldChange("summary", "");
            onFieldChange("skills", "");
            onFieldChange("experienceHtml", "");
            onFieldChange("educationHtml", "");
            onFieldChange("projectsHtml", "");
            onFieldChange("website", "");
            onFieldChange("linkedin", "");
          }}
        />
      </form>
    </motion.main>
  );
}

export default CVForm;
