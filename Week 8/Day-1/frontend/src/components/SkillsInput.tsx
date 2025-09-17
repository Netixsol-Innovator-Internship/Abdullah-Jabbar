import React from "react";
import { WithContext as ReactTags, Tag } from "react-tag-input";
import { CVFields } from "../types/cv";

type Props = {
  fields: CVFields;
  onFieldChange: (field: keyof CVFields, value: string) => void;
};

export default function SkillsInput({ fields, onFieldChange }: Props) {
  const skillsToTags = (skills: string): Tag[] => {
    return skills
      .split(",")
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length > 0)
      .map((skill: string) => ({
        id: skill.toLowerCase().replace(/\s+/g, "-"),
        className: "",
        text: skill,
      })) as Tag[];
  };

  const tagsToSkills = (tags: Tag[]): string => {
    return tags
      .map((t) => (t as unknown as { text?: string }).text || t.id)
      .join(", ");
  };

  const handleSkillsChange = (tags: Tag[]) => {
    onFieldChange("skills", tagsToSkills(tags));
  };

  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">Skills</label>
      <ReactTags
        tags={skillsToTags(fields.skills)}
        handleDelete={(i) => {
          const tags = skillsToTags(fields.skills);
          tags.splice(i, 1);
          handleSkillsChange(tags);
        }}
        handleAddition={(tag) => {
          const tags = skillsToTags(fields.skills);
          tags.push({
            id: tag.id,
            className: "",
            text: (tag as Tag & { text?: string }).text || tag.id,
          });
          handleSkillsChange(tags);
        }}
        handleDrag={(tag, currPos, newPos) => {
          const tags = skillsToTags(fields.skills);
          tags.splice(currPos, 1);
          tags.splice(newPos, 0, tag as Tag);
          handleSkillsChange(tags);
        }}
        inputFieldPosition="bottom"
        autocomplete
        placeholder="Add a skill"
        classNames={{
          tags: "flex flex-wrap gap-2 mb-2",
          tagInput: "w-full",
          tagInputField:
            "w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400",
          selected: "flex flex-wrap gap-2",
          tag: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 relative",
          remove:
            "absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors rounded-full [&>*]:hidden before:content-[''] before:block before:w-2.5 before:h-0.5 before:bg-white before:rotate-45 before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:block after:w-2.5 after:h-0.5 after:bg-white after:-rotate-45 after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2",
          suggestions:
            "absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto",
          activeSuggestion: "bg-blue-50",
          // `suggestion` is not part of the classNames type in this
          // version of react-tag-input; remove it to satisfy the TS types.
        }}
      />
    </div>
  );
}
