// "Jump to…" search (Ctrl+K / ⌘K): every page and common action the account can use,
// filtered as you type, chosen with the arrow keys and Enter.
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Building2, CornerDownLeft, KeyRound, Mail, Map, Moon, PenLine, Search, ShieldAlert, Sun, UserRound } from "lucide-react";
import { NAV_SECTIONS } from "./SideBar";
import { useCurrentUser } from "../ui";

export default function CommandPalette({ open, onClose, theme, onToggleTheme }) {
  const navigate = useNavigate();
  const { can } = useCurrentUser();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const items = useMemo(() => {
    const pages = NAV_SECTIONS.flatMap((s) =>
      s.items.filter((i) => !i.perm || can(i.perm)).map((i) => ({ group: s.label, label: i.label, icon: i.icon, run: () => navigate(i.href), keywords: s.label }))
    );
    const actions = [
      can("content.create") && { label: "Write a blog post or article", icon: PenLine, to: "/admin/articles", keywords: "new create draft" },
      can("content.create") && { label: "Add a publication or report", icon: BookOpen, to: "/admin/adminpublications", keywords: "new upload pdf" },
      can("content.create") && { label: "Log an enforcement event", icon: ShieldAlert, to: "/admin/enforcement", keywords: "new case" },
      can("policy.edit") && { label: "Update AWPII scores", icon: Map, to: "/admin/policy-tracker", keywords: "tracker country" },
      can("content.create") && { label: "Add a startup", icon: Building2, to: "/admin/state-of-web3", keywords: "new company directory" },
      can("newsletter.send") && { label: "Send a newsletter", icon: Mail, to: "/admin/newsletter", keywords: "campaign email" },
    ].filter(Boolean).map((a) => ({ ...a, group: "Actions", run: () => navigate(a.to) }));
    const prefs = [
      { group: "Preferences", label: theme === "light" ? "Switch to dark mode" : "Switch to light mode", icon: theme === "light" ? Moon : Sun, run: onToggleTheme, keywords: "theme appearance colour color" },
      { group: "Preferences", label: "Edit my profile", icon: UserRound, run: () => navigate("/admin/settings"), keywords: "account name job title phone bio" },
      { group: "Preferences", label: "Change my password", icon: KeyRound, run: () => navigate("/admin/settings#security"), keywords: "account security" },
    ];
    return [...pages, ...actions, ...prefs];
  }, [can, navigate, theme, onToggleTheme]);

  const q = query.trim().toLowerCase();
  const results = q ? items.filter((i) => `${i.label} ${i.group} ${i.keywords || ""}`.toLowerCase().includes(q)) : items;

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);
  useEffect(() => setIndex(0), [query]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  if (!open) return null;

  const choose = (item) => {
    onClose();
    item?.run();
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); choose(results[index]); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
  };

  let lastGroup = null;
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Jump to">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-gray-700 px-4">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a page or action…"
            className="w-full bg-transparent py-4 text-sm text-gray-100 placeholder-gray-500 outline-none"
          />
          <kbd className="hidden sm:block rounded border border-gray-600 px-1.5 py-0.5 text-[10px] text-gray-400">Esc</kbd>
        </div>
        <ul ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-gray-400">Nothing matches "{query}"</li>}
          {results.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            const Icon = item.icon;
            const active = i === index;
            return (
              <li key={`${item.group}-${item.label}`}>
                {header && <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">{header}</p>}
                <button
                  data-index={i}
                  onMouseMove={() => setIndex(i)}
                  onClick={() => choose(item)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${active ? "bg-yellow-500/15 text-yellow-300" : "text-gray-200"}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {active ? <CornerDownLeft className="w-3.5 h-3.5 opacity-70" /> : <ArrowRight className="w-3.5 h-3.5 opacity-0" />}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-4 border-t border-gray-700 px-4 py-2 text-[11px] text-gray-500">
          <span><kbd className="font-sans">↑</kbd> <kbd className="font-sans">↓</kbd> to move</span>
          <span><kbd className="font-sans">Enter</kbd> to open</span>
          <span className="ml-auto">Ctrl K anywhere</span>
        </div>
      </div>
    </div>
  );
}
