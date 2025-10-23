"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/i18nContext";

interface SlippageSelectorProps {
  slippage: number;
  onSlippageChange: (slippage: number) => void;
}

export default function SlippageSelector({
  slippage,
  onSlippageChange,
}: SlippageSelectorProps) {
  const { t } = useI18n();
  const [showCustomInput, setShowCustomInput] = useState(
    ![0.1, 0.5, 1.0].includes(slippage)
  );
  const [customValue, setCustomValue] = useState(
    showCustomInput ? slippage.toString() : "1.0"
  );

  // Predefined slippage options
  const slippageOptions = [
    { value: 0.1, label: "0.1%" },
    { value: 0.5, label: "0.5%" },
    { value: 1.0, label: "1.0%" },
  ];

  const handleOptionClick = (value: number) => {
    onSlippageChange(value);
    setShowCustomInput(false);
  };

  const handleCustomClick = () => {
    setShowCustomInput(true);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 50) {
      onSlippageChange(numValue);
    }
  };

  return (
    <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-xl p-4 mt-4">
      <div className="text-[var(--text-secondary)] mb-3 text-sm font-medium">
        {t("dex.slippage")}
      </div>
      <div className="flex gap-2 flex-wrap">
        {slippageOptions.map((option) => (
          <button
            key={option.value}
            className={`bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-secondary)] px-4 py-2 rounded-lg cursor-pointer font-medium text-sm transition-all duration-200 min-w-[60px] text-center hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] ${
              slippage === option.value && !showCustomInput
                ? "bg-[rgba(99,102,241,0.1)] border-[var(--primary-color)] text-[var(--primary-color)]"
                : ""
            }`}
            onClick={() => handleOptionClick(option.value)}
          >
            {option.label}
          </button>
        ))}
        <button
          className={`bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-secondary)] px-4 py-2 rounded-lg cursor-pointer font-medium text-sm transition-all duration-200 min-w-[60px] text-center hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] ${showCustomInput ? "bg-[rgba(99,102,241,0.1)] border-[var(--primary-color)] text-[var(--primary-color)]" : ""}`}
          onClick={handleCustomClick}
        >
          {showCustomInput ? (
            <input
              type="text"
              value={customValue}
              onChange={handleCustomChange}
              className="bg-transparent border-none text-[var(--primary-color)] w-full text-center font-medium text-sm p-0 focus:outline-none"
              placeholder={t("dex.custom")}
              autoFocus
              onBlur={() => {
                if (customValue === "" || isNaN(parseFloat(customValue))) {
                  setCustomValue("1.0");
                  onSlippageChange(1.0);
                }
              }}
            />
          ) : (
            t("dex.custom")
          )}
        </button>
      </div>
      {parseFloat(customValue) > 5 && (
        <div className="mt-3 text-[var(--warning-color)] text-sm flex items-center gap-1">
          ⚠️ {t("dex.highSlippageWarning")}
        </div>
      )}
    </div>
  );
}
