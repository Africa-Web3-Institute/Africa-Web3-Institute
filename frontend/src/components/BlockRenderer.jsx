// src/components/BlockRenderer.jsx
// Shows blocks on the public site and in the admin preview. Plain React, no raw HTML is ever injected.
import { Fragment } from "react";
import { safeUrl, safeImageUrl } from "../lib/blocks";

const INLINE = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\([^)\s]+\))/g;

// **bold**, *italic*, [text](https://link)
export function renderInline(text) {
  const parts = String(text || "").split(INLINE);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    const m = p.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (m) {
      const href = safeUrl(m[2]);
      if (!href) return <Fragment key={i}>{m[1]}</Fragment>;
      const external = /^https?:/i.test(href);
      return (
        <a
          key={i}
          href={href}
          className="text-[#D4A017] underline underline-offset-2 hover:opacity-80"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {m[1]}
        </a>
      );
    }
    return <Fragment key={i}>{p}</Fragment>;
  });
}

const lines = (t) => String(t || "").split("\n").map((l) => l.trim()).filter(Boolean);

export default function BlockRenderer({ blocks }) {
  return (
    <div className="space-y-5" data-testid="block-renderer">
      {(blocks || []).map((b) => {
        switch (b.type) {
          case "heading":
            return (
              <h2 key={b.id} className="text-2xl font-bold text-secondary pt-4">
                {renderInline(b.text)}
              </h2>
            );
          case "subheading":
            return (
              <h3 key={b.id} className="text-xl font-semibold text-secondary pt-2">
                {renderInline(b.text)}
              </h3>
            );
          case "quote":
            return (
              <blockquote key={b.id} className="border-l-4 border-[#D4A017] pl-5 italic text-lg text-foreground/80">
                {renderInline(b.text)}
                {b.cite ? <footer className="mt-2 text-sm not-italic text-muted-foreground">— {b.cite}</footer> : null}
              </blockquote>
            );
          case "bullets":
            return (
              <ul key={b.id} className="list-disc pl-6 space-y-2 text-lg text-foreground/80">
                {lines(b.text).map((l, i) => (
                  <li key={i}>{renderInline(l)}</li>
                ))}
              </ul>
            );
          case "numbered":
            return (
              <ol key={b.id} className="list-decimal pl-6 space-y-2 text-lg text-foreground/80">
                {lines(b.text).map((l, i) => (
                  <li key={i}>{renderInline(l)}</li>
                ))}
              </ol>
            );
          case "callout":
            return (
              <div key={b.id} className="rounded-xl bg-[#D4A017]/10 border border-[#D4A017]/30 p-5 text-foreground/90 leading-relaxed whitespace-pre-line">
                {renderInline(b.text)}
              </div>
            );
          case "image": {
            const src = safeImageUrl(b.url);
            if (!src) return null;
            return (
              <figure key={b.id} className="my-6">
                <img src={src} alt={b.alt || ""} className="w-full h-auto rounded-xl" loading="lazy" />
                {b.caption ? (
                  <figcaption className="mt-2 text-sm text-center text-muted-foreground">{b.caption}</figcaption>
                ) : null}
              </figure>
            );
          }
          case "divider":
            return <hr key={b.id} className="my-8 border-border" />;
          default:
            return (
              <p key={b.id} className="text-lg text-foreground/80 leading-relaxed whitespace-pre-line">
                {renderInline(b.text)}
              </p>
            );
        }
      })}
    </div>
  );
}
