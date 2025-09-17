import { CVFields } from "../types/cv";

export async function handleGenerate(fields: CVFields, API_BASE: string) {
  // normalize API_BASE to avoid trailing slashes which can produce '//' in URLs
  const apiBase = (API_BASE || "").replace(/\/+$/, "");
  // Convert the rich experience HTML into a simple experience array so the
  // server-side template (which expects ctx.experience as an array) will
  // render the items into the produced PDF.
  const parser = new DOMParser();
  const expDoc = parser.parseFromString(
    fields.experienceHtml || "",
    "text/html"
  );
  // collect list items first, fallback to paragraphs
  const bullets = Array.from(expDoc.querySelectorAll("li"))
    .map((li) => li.textContent?.trim() || "")
    .filter(Boolean);
  const paragraphs = Array.from(expDoc.querySelectorAll("p"))
    .map((p) => p.textContent?.trim() || "")
    .filter(Boolean);
  const experienceArray: Array<{
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }> = [];
  if (bullets.length || paragraphs.length) {
    experienceArray.push({
      role: fields.jobTitle || "Experience",
      company: "",
      period: "",
      bullets: bullets.length ? bullets : paragraphs,
    });
  }
  const payload = { ...fields, experience: experienceArray };
  try {
    const res = await fetch(`${apiBase}/api/cv/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Request failed ${res.status}`);
    const disposition = res.headers.get("content-disposition") || "";
    const filename =
      (disposition.includes("filename=") &&
        disposition.split("filename=")[1]) ||
      `${fields.fullName.replace(/\s+/g, "_")}_CV.pdf`;
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Failed to generate CV. Check console.");
    console.error(err);
  }
}

export async function handleDownloadDocx(fields: CVFields, API_BASE: string) {
  const apiBase = (API_BASE || "").replace(/\/+$/, "");
  try {
    // Prepare payload for backend
    const experienceArray = [];
    const bullets = fields.experienceHtml
      ? fields.experienceHtml.split(/<li>|<br\s*\/?>/).filter(Boolean)
      : [];
    if (bullets.length) {
      experienceArray.push({
        role: fields.jobTitle || "Experience",
        company: "",
        period: "",
        bullets,
      });
    }
    const payload = { ...fields, experience: experienceArray };
    const res = await fetch(`${apiBase}/api/cv/generate?format=docx`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Request failed ${res.status}`);
    const disposition = res.headers.get("content-disposition") || "";
    const filename =
      (disposition.includes("filename=") &&
        disposition.split("filename=")[1].replace(/"/g, "")) ||
      `${fields.fullName.replace(/\s+/g, "_")}_CV.docx`;
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Failed to download Word file from backend.");
    console.error(err);
  }
}
