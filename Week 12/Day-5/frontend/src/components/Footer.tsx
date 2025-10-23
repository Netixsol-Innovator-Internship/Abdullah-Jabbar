"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/i18nContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className="bg-[var(--card-bg)] border-t-2 border-[var(--primary-color)] text-[var(--text-primary)] pt-12 px-8 pb-8 mt-auto">
      <div className="max-w-[1400px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mb-8">
        {/* Brand Section */}
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-bold bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent mb-2">
            Planer&apos;s Mint
          </h3>
          <p className="text-sm text-[var(--text-secondary)] italic">
            {t("footer.tagline")}
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-[var(--primary-color)] mb-2 uppercase tracking-wider">
            {t("footer.quickLinks")}
          </h4>
          <ul className="list-none flex flex-col gap-2">
            <li>
              <a
                href="/dex"
                className="text-[var(--text-secondary)] no-underline text-sm transition-all duration-300 relative hover:text-[var(--primary-color)] hover:pl-2 before:content-['→'] before:opacity-0 before:absolute before:-left-5 before:transition-opacity before:duration-300 hover:before:opacity-100"
              >
                {t("navbar.dex")}
              </a>
            </li>
            <li>
              <a
                href="/marketplace"
                className="text-[var(--text-secondary)] no-underline text-sm transition-all duration-300 relative hover:text-[var(--primary-color)] hover:pl-2 before:content-['→'] before:opacity-0 before:absolute before:-left-5 before:transition-opacity before:duration-300 hover:before:opacity-100"
              >
                {t("navbar.marketplace")}
              </a>
            </li>
            <li>
              <a
                href="/portfolio"
                className="text-[var(--text-secondary)] no-underline text-sm transition-all duration-300 relative hover:text-[var(--primary-color)] hover:pl-2 before:content-['→'] before:opacity-0 before:absolute before:-left-5 before:transition-opacity before:duration-300 hover:before:opacity-100"
              >
                {t("navbar.portfolio")}
              </a>
            </li>
            <li>
              <Link
                href="/"
                className="text-[var(--text-secondary)] no-underline text-sm transition-all duration-300 relative hover:text-[var(--primary-color)] hover:pl-2 before:content-['→'] before:opacity-0 before:absolute before:-left-5 before:transition-opacity before:duration-300 hover:before:opacity-100"
              >
                {t("navbar.faucet")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-[var(--primary-color)] mb-2 uppercase tracking-wider">
            {t("footer.resources")}
          </h4>
          <ul className="list-none flex flex-col gap-2">
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] no-underline text-sm transition-all duration-300 relative hover:text-[var(--primary-color)] hover:pl-2 before:content-['→'] before:opacity-0 before:absolute before:-left-5 before:transition-opacity before:duration-300 hover:before:opacity-100"
              >
                {t("footer.documentation")}
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] no-underline text-sm transition-all duration-300 relative hover:text-[var(--primary-color)] hover:pl-2 before:content-['→'] before:opacity-0 before:absolute before:-left-5 before:transition-opacity before:duration-300 hover:before:opacity-100"
              >
                {t("footer.github")}
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] no-underline text-sm transition-all duration-300 relative hover:text-[var(--primary-color)] hover:pl-2 before:content-['→'] before:opacity-0 before:absolute before:-left-5 before:transition-opacity before:duration-300 hover:before:opacity-100"
              >
                {t("footer.support")}
              </a>
            </li>
          </ul>
        </div>

        {/* Network Info */}
        <div className="flex flex-col gap-3">
          <h4 className="text-base font-semibold text-[var(--primary-color)] mb-2 uppercase tracking-wider">
            {t("footer.network")}
          </h4>
          <p className="text-sm text-[var(--text-secondary)] m-0">
            {t("footer.networkInfo")}
          </p>
          <p className="text-xs text-[var(--text-secondary)] opacity-80 m-0">
            {t("footer.testnetInfo")}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent my-8"></div>

      {/* Bottom Section */}
      <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-4 text-center">
        <p className="text-[var(--text-secondary)] text-sm m-0">
          © {currentYear} {t("footer.copyright")}
        </p>
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <a
            href="#"
            className="text-[var(--text-secondary)] no-underline text-xs transition-colors duration-300 hover:text-[var(--primary-color)]"
          >
            {t("footer.privacy")}
          </a>
          <span className="text-[var(--text-secondary)] opacity-50">•</span>
          <a
            href="#"
            className="text-[var(--text-secondary)] no-underline text-xs transition-colors duration-300 hover:text-[var(--primary-color)]"
          >
            {t("footer.terms")}
          </a>
          <span className="text-[var(--text-secondary)] opacity-50">•</span>
          <a
            href="#"
            className="text-[var(--text-secondary)] no-underline text-xs transition-colors duration-300 hover:text-[var(--primary-color)]"
          >
            {t("footer.contact")}
          </a>
        </div>
      </div>
    </footer>
  );
}
