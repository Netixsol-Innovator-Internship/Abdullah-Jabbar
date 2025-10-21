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
    <div className="slippage-selector">
      <div className="slippage-label">{t("dex.slippage")}</div>
      <div className="slippage-options">
        {slippageOptions.map((option) => (
          <button
            key={option.value}
            className={`slippage-option ${
              slippage === option.value && !showCustomInput ? "active" : ""
            }`}
            onClick={() => handleOptionClick(option.value)}
          >
            {option.label}
          </button>
        ))}
        <button
          className={`slippage-option ${showCustomInput ? "active" : ""}`}
          onClick={handleCustomClick}
        >
          {showCustomInput ? (
            <input
              type="text"
              value={customValue}
              onChange={handleCustomChange}
              className="slippage-custom-input"
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
        <div className="slippage-warning">
          ⚠️ {t("dex.highSlippageWarning")}
        </div>
      )}
    </div>
  );
}
