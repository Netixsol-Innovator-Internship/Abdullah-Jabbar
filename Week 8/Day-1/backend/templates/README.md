# CV Template (package)

Directory structure:
- template.html            -> Handlebars-based HTML (canonical)
- template.css             -> print-first CSS tuned for A4 and page-break control
- preview-metadata.json    -> metadata for frontend form generation
- tokens.json              -> design tokens (colors, fonts, sizes)
- assets/
  - InterVar.woff2         -> primary font file (place here)
  - any svgs or images used by template

Important notes:
- Fonts: add InterVar.woff2 (or change @font-face to use a different font present on the server). Puppeteer must be able to load the font via the served static path.
- Paths: the server should serve this template folder under `/template/` (e.g., http://backend/template/template.html).
- Sanitization: template uses {{{summary}}} and {{{description}}} for limited HTML. The backend must sanitize these fields before rendering.
- DOCX: current pipeline converts rendered HTML → DOCX with html-docx-js. For better editable DOCX fidelity, create a docx template and use docxtemplater.
- Visual parity: HTML→Puppeteer → PDF will produce pixel‑perfect preview <-> PDF parity. DOCX parity is approximate unless using commercial converters or embedding PDF pages.