// src/lib/blocks.js
// The content of an article/blog is a list of "blocks" (paragraph, heading, image, ...).
// It is stored in the existing `content` text column as JSON: {"v":1,"blocks":[...]}.
// Old posts that are plain text (blank line = paragraph, "## " = heading) are still read correctly.

export const BLOCK_TYPES = [
  { type: "paragraph", label: "Paragraph" },
  { type: "heading", label: "Heading" },
  { type: "subheading", label: "Sub-heading" },
  { type: "quote", label: "Quote" },
  { type: "bullets", label: "Bulleted list" },
  { type: "numbered", label: "Numbered list" },
  { type: "image", label: "Image" },
  { type: "callout", label: "Callout" },
  { type: "divider", label: "Divider" },
];

export const TEXT_TYPES = ["paragraph", "heading", "subheading", "quote", "callout", "bullets", "numbered"];

let counter = 0;
export const uid = () => `b${Date.now().toString(36)}${(counter++).toString(36)}`;

export const newBlock = (type = "paragraph", extra = {}) => ({
  id: uid(),
  type,
  text: "",
  ...(type === "image" ? { url: "", alt: "", caption: "" } : {}),
  ...(type === "quote" ? { cite: "" } : {}),
  ...extra,
});

// Only http(s), site-relative and mailto links are allowed (blocks "javascript:" etc.)
export const safeUrl = (u) => {
  const s = String(u || "").trim();
  return /^(https?:\/\/|\/(?!\/)|mailto:)/i.test(s) ? s : "";
};
export const safeImageUrl = (u) => {
  const s = String(u || "").trim();
  return /^(https?:\/\/|\/(?!\/))/i.test(s) ? s : "";
};

const isEmpty = (b) =>
  b.type === "divider" ? false : b.type === "image" ? !safeImageUrl(b.url) : !String(b.text || "").trim();

export function serializeBlocks(blocks) {
  const clean = (blocks || [])
    .filter((b) => !isEmpty(b))
    .map(({ id, ...rest }) => rest);
  return JSON.stringify({ v: 1, blocks: clean });
}

const fromLegacyText = (text) => {
  const out = [];
  for (const chunk of text.split(/\n{2,}/)) {
    const t = chunk.trim();
    if (!t) continue;
    const lines = t.split("\n").map((l) => l.trim());
    if (lines[0].startsWith("## ") && lines.length > 1) {
      out.push(newBlock("heading", { text: lines[0].slice(3) }));
      out.push(newBlock("paragraph", { text: lines.slice(1).join("\n") }));
    } else if (t.startsWith("### ")) out.push(newBlock("subheading", { text: t.slice(4) }));
    else if (t.startsWith("## ")) out.push(newBlock("heading", { text: t.slice(3) }));
    else if (t.startsWith("# ")) out.push(newBlock("heading", { text: t.slice(2) }));
    else if (lines.every((l) => /^[-*] /.test(l)))
      out.push(newBlock("bullets", { text: lines.map((l) => l.slice(2)).join("\n") }));
    else if (lines.every((l) => /^\d+\. /.test(l)))
      out.push(newBlock("numbered", { text: lines.map((l) => l.replace(/^\d+\. /, "")).join("\n") }));
    else if (lines.every((l) => l.startsWith("> ")))
      out.push(newBlock("quote", { text: lines.map((l) => l.slice(2)).join("\n") }));
    else out.push(newBlock("paragraph", { text: t }));
  }
  return out;
};

// Accepts: JSON string from the admin, an array of paragraph strings (data/posts.js), or old plain text.
export function parseContent(content) {
  if (Array.isArray(content)) {
    return content.flatMap((l) => fromLegacyText(String(l)));
  }
  if (typeof content !== "string" || !content.trim()) return [];
  const s = content.trim();
  if (s.startsWith("{")) {
    try {
      const j = JSON.parse(s);
      if (j && j.v === 1 && Array.isArray(j.blocks)) {
        return j.blocks
          .filter((b) => b && typeof b.type === "string")
          .map((b) => ({ ...newBlock(b.type), ...b, id: uid() }));
      }
    } catch {
      /* not JSON: treat as text */
    }
  }
  return fromLegacyText(s);
}

export function blocksToPlainText(blocks) {
  return (blocks || [])
    .map((b) => (b.type === "image" ? b.caption || "" : String(b.text || "")))
    .join(" ")
    .replace(/\*\*|\*|\[([^\]]*)\]\([^)]*\)/g, "$1");
}

export function estimateReadTime(blocks) {
  const words = blocksToPlainText(blocks).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

// First ~200 characters of body text, for an excerpt when none was written.
export function autoExcerpt(blocks, max = 200) {
  const first = (blocks || []).find((b) => ["paragraph", "callout"].includes(b.type) && String(b.text || "").trim());
  if (!first) return "";
  const t = blocksToPlainText([first]).replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max - 1).trimEnd() + "…";
}
