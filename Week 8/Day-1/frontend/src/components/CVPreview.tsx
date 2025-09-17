"use client";

import React, { useEffect, useRef } from "react";

interface CVPreviewProps {
  renderedHtml: string;
}

function CVPreview({ renderedHtml }: CVPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    // Use srcdoc so the iframe receives the full HTML (head + body) including
    // any inlined <style> or <base> tags. Falls back to document.write when
    // srcdoc isn't supported.
    try {
      const el = iframeRef.current as HTMLIFrameElement | null;
      if (!el) return;
      // Ensure the preview always has some professional CSS applied. Parse the
      // rendered HTML and inject a minimal style into <head> if present, or
      // wrap the content with a full document that includes the styles.
      const defaultCss = `/* Font setup */
@font-face {
  font-family: 'InterVar';
  src: url('assets/InterVar.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

:root {
      --accent: #0ea5a4;
      --muted: #6b7280;
      --heading: #0f172a;
      /* Use true A4 dimensions for the preview page */
      --page-width: 210mm;    /* A4 width */
      --page-height: 297mm;   /* A4 height */
      --max-width: 210mm;
}

/* Reset */
body {
  margin: 0;
  padding: 0;
  color: #111;
  background: #fff;
  font-family: InterVar, Arial, Helvetica, sans-serif;
  line-height: 1.25;
  /* ensure long words wrap instead of overflowing */
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}

/* Reset paragraph/div margins inside the page so Enter produces a single line-height gap */
.page p,
.page div {
  margin: 0;
  padding: 0;
}
.page p + p,
.page div + p,
.page p + div {
  margin-top: 0.15em; /* slightly tighter gap between paragraphs */
}

/* Core page - responsive for preview */
.page {
  width: var(--page-width);
  max-width: var(--max-width);
  height: var(--page-height);
  margin: 0 auto;
  background: #fff;
  box-sizing: border-box;
  padding: 20px;
  /* prevent overflow from very long strings */
  overflow-wrap: anywhere;
  word-break: break-word;
  /* make page visible with a border and slight shadow */
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden; /* hide spillover so pagination can move nodes to new pages */
}

/* Footer that displays page numbering */
.page-footer {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: var(--muted);
  pointer-events: none;
}

/* Add a visual divider between stacked pages in the preview */
.page + .page {
  margin-top: 18px;
}

/* Preview mode adjustments */
@media screen {
  .page {
    margin: 0 auto;
    padding: 20px;
  }
}

/* Print rules - maintain A4 sizing for actual printing */
@media print {
  :root {
    --page-width: 210mm;
    --page-height: 297mm;
  }
  
  @page {
    size: A4;
    margin: 1.5cm;
  }
  
  body {
    background: none;
    color: #000;
  }
  
  .page {
    width: 210mm;
    max-width: none;
    border: none;
    margin: 0;
    padding: 0;
    box-shadow: none;
    border-radius: 0;
  }
  
  a {
    color: black;
    text-decoration: none;
  }
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 24px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 16px;
}

.header h1 {
  margin: 0;
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 700;
  color: var(--accent);
}

.header .title {
  margin: 4px 0 12px;
  font-size: clamp(14px, 3vw, 18px);
  font-weight: 500;
  color: var(--muted);
}

/* Info row */
.info-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  font-size: clamp(12px, 2.5vw, 14px);
  color: #374151;
  gap: 0;
  white-space: nowrap;
  overflow: hidden;
}

.info-row span {
  display: inline-flex;
  align-items: center;
  margin: 0;
  position: relative;
  flex-shrink: 1;
  min-width: 0;
}

.info-row span:not(:first-child)::before {
  content: "•";
  margin: 0 8px;
  color: var(--muted);
  flex-shrink: 0;
}

.info-row span a,
.info-row span {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* Sections */
section {
  margin-bottom: 20px;
}

section h3 {
  margin: 0 0 12px;
  font-size: clamp(14px, 3vw, 16px);
  font-weight: 600;
  color: var(--heading);
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 4px;
  letter-spacing: 0.5px;
}

.summary p {
  margin: 0;
  font-size: clamp(12px, 2.5vw, 14px);
  color: #374151;
  /* allow long lines to wrap instead of overflowing */
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* Experience */
.exp-item {
  margin-bottom: 16px;
}

.exp-head {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: clamp(12px, 2.5vw, 14px);
  font-weight: 600;
  color: var(--heading);
  gap: 8px;
}

.exp-head .period {
  font-weight: normal;
  color: var(--muted);
  font-size: clamp(11px, 2vw, 13px);
}

.bullets {
  margin: 6px 0 0 20px;
  padding: 0;
  font-size: clamp(12px, 2.5vw, 14px);
  color: #374151;
}

.bullets li {
  margin-bottom: 4px;
}

/* Education */
.education ul {
  margin: 0;
  padding-left: 20px;
  font-size: clamp(12px, 2.5vw, 14px);
  color: #374151;
}

.edu-year {
  color: var(--muted);
  font-size: clamp(11px, 2vw, 13px);
  margin-left: 6px;
}

/* Projects */
.project {
  margin-bottom: 16px;
}

.proj-head {
  font-size: clamp(12px, 2.5vw, 14px);
  font-weight: 600;
  color: var(--heading);
}

.proj-desc {
  font-size: clamp(12px, 2.5vw, 14px);
  margin: 4px 0 0;
  color: #374151;
}

/* Skills */
.skills p {
  margin: 0;
  font-size: clamp(12px, 2.5vw, 14px);
  color: #374151;
}

/* Mobile responsiveness for very small screens */
@media screen and (max-width: 480px) {
  .page {
    padding: 15px;
  }
  
  .info-row {
    flex-wrap: wrap;
    white-space: normal;
    gap: 4px;
  }
  
  .info-row span {
    white-space: normal;
  }
  
  .exp-head {
    flex-direction: column;
    gap: 4px;
  }
}`;

      let finalHtml = "";
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(
          renderedHtml || "<div></div>",
          "text/html"
        );
        const head = doc.querySelector("head");
        if (head) {
          // append our default CSS so preview is styled even if the template
          // only referenced external styles that aren't reachable.
          const styleEl = doc.createElement("style");
          styleEl.textContent = defaultCss;
          head.appendChild(styleEl);
          // ensure page wrapper exists for spacing when template provides body-only content
          if (!doc.querySelector(".page")) {
            const body = doc.body || doc.querySelector("body");
            const wrapper = doc.createElement("div");
            wrapper.className = "page";
            // move existing body children into wrapper
            while (body && body.firstChild) {
              wrapper.appendChild(body.firstChild);
            }
            if (body) body.appendChild(wrapper);
          }
          finalHtml = doc.documentElement
            ? doc.documentElement.outerHTML
            : renderedHtml || "";
        } else {
          // no head -> wrap whole document
          finalHtml = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${defaultCss}</style></head><body><div class="page">${renderedHtml || ""}</div></body></html>`;
        }
      } catch {
        finalHtml = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${defaultCss}</style></head><body><div class="page">${renderedHtml || ""}</div></body></html>`;
      }

      // no pagination script: we intentionally render a single A4-sized page only

      if ("srcdoc" in el) {
        (el as HTMLIFrameElement).srcdoc = finalHtml;
      } else if ((el as HTMLIFrameElement).contentDocument) {
        const docEl = (el as HTMLIFrameElement).contentDocument!;
        docEl.open();
        docEl.write(finalHtml);
        docEl.close();
      }
    } catch {
      // ignore errors writing to iframe
    }
  }, [renderedHtml]);

  return (
    <aside className="md:col-span-7 col-span-1 mt-8 md:mt-0">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Preview</h2>
      <div className="border rounded-xl overflow-hidden bg-white shadow-lg">
        <iframe
          ref={iframeRef}
          title="cv-preview"
          // A4 at 96dpi: 210mm ≈ 794px, 297mm ≈ 1123px
          style={{
            width: "794px",
            height: "1123px",
            border: 0,
            display: "block",
            margin: "0 auto",
          }}
          className="bg-white"
        />
      </div>
    </aside>
  );
}

export default CVPreview;
