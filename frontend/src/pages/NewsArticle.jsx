// src/pages/NewsArticle.jsx
// /publications/:slug  -> a blog post (from the admin / data/posts.js)
// /news/:slug          -> a news item (from News.jsx)
import { useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { NEWS_DATA } from "./News";
import { usePost } from "../lib/usePosts";
import BlockRenderer from "../components/BlockRenderer";
import { parseContent } from "../lib/blocks";

const formatDate = (dateString) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(dateString)
  );

// Sets the browser-tab title and search snippet for this page, and puts them back on leave.
function usePageMeta(title, description, noindex = false) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    let tag = document.querySelector('meta[name="description"]');
    const prevDesc = tag ? tag.getAttribute("content") : null;
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    if (description) tag.setAttribute("content", description);
    let robots = null;
    if (noindex) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      robots.setAttribute("content", "noindex");
      document.head.appendChild(robots);
    }
    return () => {
      document.title = prevTitle;
      if (prevDesc !== null) tag.setAttribute("content", prevDesc);
      if (robots) robots.remove();
    };
  }, [title, description, noindex]);
}

export default function NewsArticle() {
  const { slug } = useParams();
  const { pathname } = useLocation();

  // Items written in the admin come from the server; the old sample items in News.jsx are a fallback.
  const sample = pathname.startsWith("/news") ? NEWS_DATA.find((n) => n.slug === slug) : null;
  const { post, loading: fetching } = usePost(sample ? null : slug);
  const article = sample || post;
  const loading = !sample && fetching;
  const isPost = Boolean(post);

  const backTo = pathname.startsWith("/publications") ? "/publications" : "/news";
  const backLabel = backTo === "/news" ? "Back to News" : "Back to Publications";

  usePageMeta(
    article
      ? `${article.title} | Africa Web3 Institute`
      : loading
      ? "Africa Web3 Institute"
      : "Article not found | Africa Web3 Institute",
    article ? article.excerpt : "",
    !loading && !article
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold text-secondary mb-4">Article not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-[#D4A017] font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>
    );
  }

  const blocks = parseContent(article.body);
  const shown = blocks.length ? blocks : parseContent(article.excerpt);

  return (
    <div className="bg-white min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
            {(article.category || isPost) && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4A017]/10 text-[#D4A017] font-medium">
                {article.category || "Published Articles"}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(article.date)}
            </span>
            {article.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {article.readTime}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-secondary leading-tight">
            {article.title}
          </h1>

          {article.author && (
            <p className="mt-4 text-sm text-muted-foreground">
              By <strong className="text-secondary">{article.author}</strong>
              {article.authorRole ? `, ${article.authorRole}` : ""}
            </p>
          )}
        </header>

        {article.image && (
          <div className="rounded-2xl overflow-hidden mb-8 bg-[#0B1437]">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        <BlockRenderer blocks={shown} />

        {isPost && (
          <p className="mt-10 text-xs text-muted-foreground italic">
            Views expressed are the author's own and do not necessarily reflect the position of
            Africa Web3 Institute.
          </p>
        )}

        <div className="mt-12 border-t border-border pt-6">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4A017] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> {backLabel}
          </Link>
        </div>
      </article>
    </div>
  );
}
