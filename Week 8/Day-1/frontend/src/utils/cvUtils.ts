import { CVFields } from "../types/cv";

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function stripOuterParagraph(html: string) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const body = doc.body;
    // If the body contains exactly one top-level element and it's a <p>, unwrap it
    if (
      body.children.length === 1 &&
      body.firstElementChild &&
      body.firstElementChild.tagName.toLowerCase() === "p"
    ) {
      return body.firstElementChild.innerHTML || "";
    }
    return html;
  } catch {
    return html;
  }
}

export function renderTemplate(template: string, data: CVFields) {
  // Support both mustache placeholders ({{field}}) and templates that
  // use elements with data-field="..." attributes. We first do the
  // simple mustache-style replacements, then parse the HTML and inject
  // content into elements that use data-field so the preview matches
  // server-side injection behavior.
  let out = template;
  out = out.replace(/{{fullName}}/g, escapeHtml(data.fullName));
  out = out.replace(/{{jobTitle}}/g, escapeHtml(data.jobTitle));
  out = out.replace(/{{email}}/g, escapeHtml(data.email));
  out = out.replace(/{{phone}}/g, escapeHtml(data.phone));
  out = out.replace(/{{summary}}/g, escapeHtml(data.summary));
  out = out.replace(/{{skills}}/g, escapeHtml(data.skills));
  // some templates may include a direct {{experienceHtml}} placeholder
  // instead of an element with data-field - support that too (insert raw HTML)
  out = out.replace(/{{experienceHtml}}/g, data.experienceHtml);
  // support triple-mustache for summary (raw HTML) — sanitize and unwrap a single <p>
  try {
    const sanitized = sanitizeHtmlForPreview(data.summary);
    const normalized = stripOuterParagraph(sanitized);
    out = out.replace(/{{{\s*summary\s*}}}/g, normalized);
  } catch {
    out = out.replace(/{{{\s*summary\s*}}}/g, data.summary);
  }
  // support website/linkedin placeholders
  out = out.replace(
    /{{website}}/g,
    escapeHtml((data as unknown as Record<string, string>).website || "")
  );
  out = out.replace(
    /{{linkedin}}/g,
    escapeHtml((data as unknown as Record<string, string>).linkedin || "")
  );

  // Replace Handlebars experience blocks (comprehensive template uses
  // {{#if experience}} ... {{/if}} containing an {{#each experience}} loop).
  // For the preview, inject the pre-rendered experienceHtml directly so the
  // user sees their rich editor content in the iframe.
  out = out.replace(
    /{{#if\s+experience}}[\s\S]*?{{\/if}}/g,
    `<div data-field="experienceHtml">${data.experienceHtml}</div>`
  );

  // Inject website/linkedin blocks so they appear in preview even though
  // the server template uses Handlebars conditionals.
  out = out.replace(
    /{{#if\s+website}}[\s\S]*?{{\/if}}/g,
    `<p class="contact" data-field="website"></p>`
  );
  out = out.replace(
    /{{#if\s+linkedin}}[\s\S]*?{{\/if}}/g,
    `<p class="contact" data-field="linkedin"></p>`
  );

  // Education and projects blocks: replace the whole Handlebars section with
  // a placeholder element we can populate with rendered HTML for preview.
  out = out.replace(
    /{{#if\s+education}}[\s\S]*?{{\/if}}/g,
    `<div data-field="educationHtml">${(data as unknown as Record<string, string>).educationHtml || ""}</div>`
  );
  out = out.replace(
    /{{#if\s+projects}}[\s\S]*?{{\/if}}/g,
    `<div data-field="projectsHtml">${(data as unknown as Record<string, string>).projectsHtml || ""}</div>`
  );

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(out, "text/html");

    // Inject values into any element that uses data-field="..." so that
    // templates which rely on those attributes are populated correctly.
    doc.querySelectorAll("[data-field]").forEach((el) => {
      const name = el.getAttribute("data-field") || "";
      if (!name) return;
      if (name === "experienceHtml") {
        // experienceHtml is rich HTML (already sanitized before calling)
        el.innerHTML = data.experienceHtml;
      } else if (name === "educationHtml") {
        el.innerHTML =
          (data as unknown as Record<string, string>).educationHtml || "";
      } else if (name === "projectsHtml") {
        el.innerHTML =
          (data as unknown as Record<string, string>).projectsHtml || "";
      } else if (name === "summary") {
        // summary may contain rich HTML from the editor; sanitize and
        // unwrap a single outer <p> so single-line summaries don't get an
        // extra paragraph wrapper in the preview.
        const raw = (data as unknown as Record<string, string>)[name] || "";
        el.innerHTML = stripOuterParagraph(sanitizeHtmlForPreview(raw));
      } else {
        // For email/phone, render clickable links (mailto/tel). For others,
        // set textContent to avoid accidental HTML injection.
        const val = (data as unknown as Record<string, string>)[name] || "";
        if (name === "email") {
          const safe = escapeHtml(val);
          el.innerHTML = `<a href="mailto:${encodeURIComponent(val)}">${safe}</a>`;
        } else if (name === "phone") {
          // normalize phone for tel: (keep + and digits)
          const tel = val.replace(/[^+\d]/g, "");
          const safe = escapeHtml(val);
          el.innerHTML = `<a href="tel:${encodeURIComponent(tel)}">${safe}</a>`;
        } else if (name === "website") {
          const url = val || "";
          if (url) {
            const href = /^(https?:)?\/\//.test(url) ? url : `https://${url}`;
            el.innerHTML = `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a>`;
          } else {
            el.textContent = "";
          }
        } else if (name === "linkedin") {
          const url = val || "";
          if (url) {
            const href = /^(https?:)?\/\//.test(url) ? url : `https://${url}`;
            el.innerHTML = `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a>`;
          } else {
            el.textContent = "";
          }
        } else {
          el.textContent = val;
        }
      }
    });

    // Some templates render contact info as a single element (e.g. <p class="contact">{{email}} • {{phone}}</p>).s
    // Populate those with formatted links so contact details are visible and clickable in preview.
    doc.querySelectorAll(".contact").forEach((el) => {
      // If this .contact element is actually a data-field placeholder
      // (e.g. was injected as <p class="contact" data-field="website">)
      // then skip it - it will be populated by the data-field handler above.
      if (el.hasAttribute("data-field")) return;
      const email = (data as unknown as Record<string, string>).email || "";
      const phone = (data as unknown as Record<string, string>).phone || "";
      const parts: string[] = [];
      if (email)
        parts.push(
          `<a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a>`
        );
      if (phone) {
        const tel = phone.replace(/[^+\d]/g, "");
        parts.push(
          `<a href="tel:${encodeURIComponent(tel)}">${escapeHtml(phone)}</a>`
        );
      }
      if (parts.length)
        el.innerHTML = parts
          .join("  " + "\u001F\u001F" /* placeholder separator */)
          .replace(/\u001F\u001F/g, " • ");
    });

    return doc.documentElement ? doc.documentElement.outerHTML : out;
  } catch {
    // If DOMParser isn't available for some reason, fall back to the
    // string-based output we already prepared.
    return out;
  }
}

export function sanitizeHtmlForPreview(input: string) {
  // run in browser only - use DOMParser to remove editor/toolbars and unsafe tags/attrs
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");

    // remove Quill toolbar/editor wrappers (classes like ql-toolbar, ql-container, ql-editor)
    doc
      .querySelectorAll('[class^="ql-"] , [class*=" ql-"]')
      .forEach((el) => el.remove());

    // remove script and style tags inside the content
    doc.querySelectorAll("script, style").forEach((el) => el.remove());

    // remove contenteditable/data-editable and any inline event handlers or ids
    doc.querySelectorAll("*").forEach((el) => {
      el.removeAttribute("contenteditable");
      el.removeAttribute("data-editable");
      el.removeAttribute("id");
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name.startsWith("on") || attr.name.startsWith("aria-")) {
          el.removeAttribute(attr.name);
        }
      });
    });

    // Remove empty paragraphs/divs (those that only contain <br>, &nbsp; or whitespace)
    Array.from(doc.querySelectorAll("p, div")).forEach((el) => {
      try {
        const html = (el.innerHTML || "")
          .replace(/<br\s*\/?>(\s|\u00A0)*/gi, "")
          .replace(/&nbsp;/gi, "")
          .trim();
        const text = (el.textContent || "").replace(/\u00A0/g, "").trim();
        if (html === "" && text === "") {
          el.remove();
        }
      } catch {
        // ignore individual node errors
      }
    });

    return doc.body.innerHTML || "";
  } catch {
    // if DOMParser not available or parsing fails, fallback to a very small passthrough
    return input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  }
}
