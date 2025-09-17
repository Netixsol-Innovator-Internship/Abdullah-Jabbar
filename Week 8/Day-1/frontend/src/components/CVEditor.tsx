"use client";

import React, { useEffect, useState } from "react";
import { CVFields } from "../types/cv";
import { renderTemplate, sanitizeHtmlForPreview } from "../utils/cvUtils";
import {
  handleGenerate as generatePDF,
  handleDownloadDocx as downloadDocx,
} from "../utils/downloadUtils";
import CVForm from "./CVForm";
import CVPreview from "./CVPreview";

export default function CVEditor() {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);
  // base URL for backend; fallback to relative paths when empty
  // strip any trailing slashes so concatenation doesn't produce '//' paths
  const rawApiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const API_BASE = rawApiBase.replace(/\/+$/, "");
  const [templateHtml, setTemplateHtml] = useState<string>("");
  const [renderedHtml, setRenderedHtml] = useState<string>("");
  // use empty fields but show example values as placeholders in the inputs
  const [fields, setFields] = useState<CVFields>({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    summary: "",
    experienceHtml: "",
    skills: "",
    website: "",
    linkedin: "",
    educationHtml: "",
    projectsHtml: "",
  });

  // helper to update rendered HTML
  const updateRenderedHtml = React.useCallback(
    (nextFields: CVFields) => {
      if (!templateHtml) return;
      const exampleExperience =
        "<ul><li>Led frontend migrations.</li><li>Built reusable components.</li></ul>";
      const safeFields = {
        fullName: nextFields.fullName || "Jane Doe",
        jobTitle: nextFields.jobTitle || "Frontend Engineer",
        email: nextFields.email || "jane@example.com",
        phone: nextFields.phone || "+1 555 123 4567",
        summary:
          nextFields.summary ||
          "Product-focused front-end engineer with 5+ years...",
        experienceHtml: sanitizeHtmlForPreview(
          nextFields.experienceHtml || exampleExperience
        ),
        skills: nextFields.skills || "React, TypeScript, CSS",
        website: nextFields.website || "",
        linkedin: nextFields.linkedin || "",
        educationHtml: nextFields.educationHtml || "",
        projectsHtml: nextFields.projectsHtml || "",
      };
      const rendered = renderTemplate(templateHtml, safeFields);
      setRenderedHtml(rendered);
    },
    [templateHtml]
  );

  useEffect(() => {
    // fetch the canonical template (served from backend static assets)
    // prefer the comprehensive template folder. Inline any linked CSS so
    // the preview iframe renders exactly like the final PDF layout.
    (async function loadTemplate() {
      try {
        const res = await fetch(`${API_BASE}/template/template.html`);
        const text = await res.text();

        // Parse the template and inline any <link rel="stylesheet"> contents
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        const linkEls = Array.from(
          doc.querySelectorAll('link[rel="stylesheet"]')
        );
        await Promise.all(
          linkEls.map(async (link) => {
            const href = link.getAttribute("href") || "";
            if (!href) return;
            // Resolve absolute URL for the stylesheet. If href is already absolute use it,
            // otherwise resolve relative to API_BASE (if set) or to the template folder.
            let cssUrl: string;
            try {
              cssUrl = new URL(
                href,
                API_BASE ? `${API_BASE}/template/` : window.location.href
              ).href;
            } catch {
              cssUrl = href;
            }
            try {
              const cssRes = await fetch(cssUrl);
              if (!cssRes.ok) return; // skip on failure
              const cssText = await cssRes.text();
              const styleEl = doc.createElement("style");
              styleEl.textContent = cssText;
              link.replaceWith(styleEl);
            } catch {
              // ignore individual stylesheet failures
            }
          })
        );

        // If frontend is served separately from backend, the template may contain
        // root-relative URLs like /template/... which would resolve to the frontend origin.
        // Inject a base href that points at the backend template folder so relative assets
        // inside the comprehensive template resolve correctly when API_BASE is set.
        if (API_BASE) {
          const head = doc.querySelector("head");
          if (head) {
            const base = doc.createElement("base");
            base.setAttribute("href", `${API_BASE}/template/`);
            head.insertBefore(base, head.firstChild);
          }
        }

        setTemplateHtml(
          doc.documentElement ? doc.documentElement.outerHTML : text
        );
      } catch {
        // fallback to a minimal template if fetch fails. Try to fetch the
        // canonical stylesheet and inline it so the iframe preview still
        // shows the intended styles even when template.html isn't reachable.
        let cssText = "";
        try {
          const cssUrl = `${API_BASE || ""}/template/template.css`;
          const cssRes = await fetch(cssUrl);
          if (cssRes.ok) cssText = await cssRes.text();
        } catch {
          // ignore fetch errors and continue with empty cssText
        }

        setTemplateHtml(`<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${cssText}</style></head><body>
          <div class="cv">
            <header class="header">
              <div class="left">
                <h1 data-field="fullName"></h1>
                <p class="title" data-field="jobTitle"></p>
              </div>
              <div class="right">
                <p class="contact" data-field="email"></p>
                <p class="contact" data-field="phone"></p>
                <p class="contact" data-field="website"></p>
                <p class="contact" data-field="linkedin"></p>
              </div>
            </header>
            <section class="summary"><h3>Professional Summary</h3><div data-field="summary"></div></section>
            <section class="experience"><h3>Experience</h3><div data-field="experienceHtml"></div></section>
            <section class="education"><h3>Education</h3><div data-field="educationHtml"></div></section>
            <section class="projects"><h3>Projects</h3><div data-field="projectsHtml"></div></section>
            <section class="skills"><h3>Skills</h3><div data-field="skills"></div></section>
          </div>
        </body></html>`);
      }
    })();
  }, [API_BASE]);

  useEffect(() => {
    // update rendered HTML whenever template or fields change
    updateRenderedHtml(fields);
  }, [templateHtml, fields, updateRenderedHtml]);

  const onFieldChange = (field: keyof CVFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const onGenerate = async () => {
    setLoadingPdf(true);
    await generatePDF(fields, API_BASE);
    setLoadingPdf(false);
  };

  const onDownloadDocx = async () => {
    setLoadingDocx(true);
    await downloadDocx(fields, API_BASE);
    setLoadingDocx(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        <CVForm
          fields={fields}
          onFieldChange={onFieldChange}
          loadingPdf={loadingPdf}
          loadingDocx={loadingDocx}
          onGenerate={onGenerate}
          onDownloadDocx={onDownloadDocx}
        />
        <CVPreview renderedHtml={renderedHtml} />
      </div>
    </div>
  );
}
