// src/components/BlockEditor.jsx
// Admin editor: a list of blocks you can type into, reorder, convert, duplicate and delete.
// Controlled: <BlockEditor value={blocks} onChange={setBlocks} />
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, Copy, Trash2, Bold, Italic, Link2, Plus } from "lucide-react";
import { BLOCK_TYPES, TEXT_TYPES, newBlock, safeImageUrl } from "../lib/blocks";

const field =
  "w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A017]";

const textStyle = {
  paragraph: "text-base",
  heading: "text-2xl font-bold",
  subheading: "text-xl font-semibold",
  quote: "text-base italic border-l-4 border-[#D4A017] pl-3",
  callout: "text-base bg-[#D4A017]/10",
  bullets: "text-base",
  numbered: "text-base",
};

const placeholders = {
  paragraph: "Write something…",
  heading: "Heading",
  subheading: "Sub-heading",
  quote: "Quote",
  callout: "Callout text — use for a key takeaway",
  bullets: "One item per line",
  numbered: "One item per line",
};

function TextBlock({ block, onChange, onEnter, onBackspaceEmpty, autoFocus }) {
  const ref = useRef(null);

  const fit = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  useEffect(fit, [block.text, block.type]);
  useEffect(() => {
    if (autoFocus && ref.current) ref.current.focus();
  }, [autoFocus]);

  const wrap = (before, after = before) => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const sel = value.slice(s, e) || "text";
    onChange({ text: value.slice(0, s) + before + sel + after + value.slice(e) });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + sel.length);
    });
  };
  const link = () => {
    const url = window.prompt("Link address (https://…)");
    if (!url) return;
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const sel = value.slice(s, e) || "link text";
    onChange({ text: `${value.slice(0, s)}[${sel}](${url.trim()})${value.slice(e)}` });
  };

  const multiline = block.type === "bullets" || block.type === "numbered";

  return (
    <div>
      <div className="flex gap-1 mb-1">
        <button type="button" title="Bold" aria-label="Bold" onClick={() => wrap("**")} className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800">
          <Bold size={14} />
        </button>
        <button type="button" title="Italic" aria-label="Italic" onClick={() => wrap("*")} className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800">
          <Italic size={14} />
        </button>
        <button type="button" title="Link" aria-label="Link" onClick={link} className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800">
          <Link2 size={14} />
        </button>
      </div>
      <textarea
        ref={ref}
        rows={1}
        value={block.text}
        placeholder={placeholders[block.type]}
        aria-label={`${block.type} text`}
        onChange={(e) => onChange({ text: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !multiline) {
            e.preventDefault();
            onEnter();
          } else if (e.key === "Backspace" && block.text === "") {
            e.preventDefault();
            onBackspaceEmpty();
          }
        }}
        className={`w-full resize-none overflow-hidden bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4A017] ${textStyle[block.type] || ""}`}
      />
      {block.type === "quote" && (
        <input
          className={`${field} mt-2`}
          placeholder="Who said it? (optional)"
          value={block.cite || ""}
          onChange={(e) => onChange({ cite: e.target.value })}
        />
      )}
    </div>
  );
}

function ImageBlock({ block, onChange }) {
  const src = safeImageUrl(block.url);
  return (
    <div className="space-y-2">
      <input
        className={field}
        placeholder="Image address — https://… (upload it somewhere first, then paste the link)"
        aria-label="image address"
        value={block.url || ""}
        onChange={(e) => onChange({ url: e.target.value })}
      />
      {block.url && !src && <p className="text-xs text-red-400">Address must start with https:// or /</p>}
      {src && <img src={src} alt={block.alt || ""} className="max-h-56 rounded-lg border border-gray-700" />}
      <div className="grid sm:grid-cols-2 gap-2">
        <input className={field} placeholder="Caption (optional)" aria-label="caption" value={block.caption || ""} onChange={(e) => onChange({ caption: e.target.value })} />
        <input className={field} placeholder="Describe the image (for screen readers)" aria-label="alt text" value={block.alt || ""} onChange={(e) => onChange({ alt: e.target.value })} />
      </div>
    </div>
  );
}

export default function BlockEditor({ value, onChange }) {
  const blocks = value || [];
  const [focusId, setFocusId] = useState(null);

  const update = (id, patch) => onChange(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const insertAfter = (index, type = "paragraph") => {
    const nb = newBlock(type);
    const next = [...blocks];
    next.splice(index + 1, 0, nb);
    onChange(next);
    setFocusId(nb.id);
  };
  const remove = (id) => {
    const i = blocks.findIndex((b) => b.id === id);
    onChange(blocks.filter((b) => b.id !== id));
    const prev = blocks[i - 1];
    setFocusId(prev ? prev.id : null);
  };
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const duplicate = (i) => {
    const copy = { ...blocks[i], id: newBlock().id };
    const next = [...blocks];
    next.splice(i + 1, 0, copy);
    onChange(next);
  };
  const changeType = (b, type) => {
    const base = newBlock(type);
    // keep the text when switching between text-like blocks
    const keep = TEXT_TYPES.includes(b.type) && TEXT_TYPES.includes(type) ? { text: b.text } : {};
    onChange(blocks.map((x) => (x.id === b.id ? { ...base, ...keep, id: b.id } : x)));
  };

  return (
    <div className="space-y-3" data-testid="block-editor">
      {blocks.length === 0 && (
        <p className="text-sm text-gray-500 border border-dashed border-gray-700 rounded-lg p-6 text-center">
          Nothing here yet. Add your first block below.
        </p>
      )}

      {blocks.map((b, i) => (
        <div key={b.id} className="group rounded-xl border border-gray-800 bg-gray-950/40 p-3" data-block-type={b.type}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <select
              aria-label="Block type"
              value={b.type}
              onChange={(e) => changeType(b, e.target.value)}
              className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-[#D4A017]"
            >
              {BLOCK_TYPES.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.label}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-0.5">
              <button type="button" aria-label="Move up" title="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30">
                <ArrowUp size={14} />
              </button>
              <button type="button" aria-label="Move down" title="Move down" disabled={i === blocks.length - 1} onClick={() => move(i, 1)} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30">
                <ArrowDown size={14} />
              </button>
              <button type="button" aria-label="Duplicate block" title="Duplicate" onClick={() => duplicate(i)} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800">
                <Copy size={14} />
              </button>
              <button type="button" aria-label="Delete block" title="Delete" onClick={() => remove(b.id)} className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-gray-800">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {b.type === "divider" ? (
            <hr className="border-gray-700 my-2" />
          ) : b.type === "image" ? (
            <ImageBlock block={b} onChange={(p) => update(b.id, p)} />
          ) : (
            <TextBlock
              block={b}
              autoFocus={focusId === b.id}
              onChange={(p) => update(b.id, p)}
              onEnter={() => insertAfter(i)}
              onBackspaceEmpty={() => remove(b.id)}
            />
          )}
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Plus size={12} /> Add
        </span>
        {BLOCK_TYPES.map((t) => (
          <button
            key={t.type}
            type="button"
            onClick={() => insertAfter(blocks.length - 1, t.type)}
            className="px-2.5 py-1 rounded-full text-xs text-gray-300 border border-gray-700 hover:border-[#D4A017] hover:text-[#D4A017] transition-colors"
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Tip: press <kbd className="px-1 border border-gray-700 rounded">Enter</kbd> for a new paragraph,{" "}
        <kbd className="px-1 border border-gray-700 rounded">Shift</kbd>+<kbd className="px-1 border border-gray-700 rounded">Enter</kbd> for a line break.
        Select text and use <b>B</b> / <i>I</i> / link above the box.
      </p>
    </div>
  );
}
