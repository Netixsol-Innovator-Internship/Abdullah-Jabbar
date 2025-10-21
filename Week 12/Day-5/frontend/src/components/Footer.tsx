"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/i18nContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section">
          <h3 className="footer-brand">Planer&apos;s Mint</h3>
          <p className="footer-tagline">{t("footer.tagline")}</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">{t("footer.quickLinks")}</h4>
          <ul className="footer-links">
            <li>
              <a href="/dex">{t("navbar.dex")}</a>
            </li>
            <li>
              <a href="/marketplace">{t("navbar.marketplace")}</a>
            </li>
            <li>
              <a href="/portfolio">{t("navbar.portfolio")}</a>
            </li>
            <li>
              <Link href="/">{t("navbar.faucet")}</Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h4 className="footer-heading">{t("footer.resources")}</h4>
          <ul className="footer-links">
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                {t("footer.documentation")}
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                {t("footer.github")}
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                {t("footer.support")}
              </a>
            </li>
          </ul>
        </div>

        {/* Network Info */}
        <div className="footer-section">
          <h4 className="footer-heading">{t("footer.network")}</h4>
          <p className="footer-text">{t("footer.networkInfo")}</p>
          <p className="footer-text text-small">{t("footer.testnetInfo")}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider"></div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p className="footer-text">
          © {currentYear} {t("footer.copyright")}
        </p>
        <div className="footer-credits">
          <a href="#" className="footer-link-small">
            {t("footer.privacy")}
          </a>
          <span className="footer-separator">•</span>
          <a href="#" className="footer-link-small">
            {t("footer.terms")}
          </a>
          <span className="footer-separator">•</span>
          <a href="#" className="footer-link-small">
            {t("footer.contact")}
          </a>
        </div>
      </div>
    </footer>
  );
}
