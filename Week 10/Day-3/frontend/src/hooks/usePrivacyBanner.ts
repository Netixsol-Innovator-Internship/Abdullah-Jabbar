import { useState } from "react";

export const usePrivacyBanner = () => {
  const [isPolicyBannerVisible, setIsPolicyBannerVisible] = useState(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem(
        "healthcareAI-privacyBannerDismissed"
      );
      return dismissed !== "true";
    }
    return true;
  });

  const handlePrivacyBannerDismiss = () => {
    setIsPolicyBannerVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("healthcareAI-privacyBannerDismissed", "true");
    }
  };

  return {
    isPolicyBannerVisible,
    handlePrivacyBannerDismiss,
  };
};
