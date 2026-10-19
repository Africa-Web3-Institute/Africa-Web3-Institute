// src/pages/NewsArticle.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { Calendar, Clock, ArrowLeft, User, Share2 } from "lucide-react";
import { NEWS_DATA } from "./News";
import { articlesApi } from "../api/api";

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
};

export default function NewsArticle() {
  const { slug } = useParams(); // gets the slug from the URL (e.g., "awpii-launch")
  const { language } = useLanguage();
  const T = t[language]?.news || {};
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    articlesApi
      .getBySlug(slug)
      .then((res) => {
        if (!mounted) return;
        const item = res?.data || res;
        if (item && item.title) {
          setArticle(item);
        } else {
          const found = NEWS_DATA.find((item) => item.slug === slug);
          setArticle(found || null);
        }
      })
      .catch(() => {
        if (!mounted) return;
        const found = NEWS_DATA.find((item) => item.slug === slug);
        setArticle(found || null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  // Show a loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#D4A017] rounded-full animate-spin"></div>
      </div>
    );
  }

  // If article not found, show a 404 message
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
        <h1 className="text-3xl font-bold text-secondary mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
        <Link to="/news" className="inline-flex items-center gap-2 text-[#D4A017] font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    );
  }

  // Render article content
  const renderBody = () => {
    if (article.content) {
      const paragraphs = article.content.split("\n\n");
      return paragraphs.map((para, idx) => {
        const text = para.trim();
        if (!text) return null;
        if (text.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-2xl font-bold text-secondary mt-8 mb-4">
              {text.replace("## ", "")}
            </h2>
          );
        }
        if (text.startsWith("> ")) {
          return (
            <blockquote key={idx} className="border-l-4 border-[#D4A017] bg-[#D4A017]/10 p-4 rounded-r-lg my-6 italic text-slate-800">
              {text.replace("> ", "")}
            </blockquote>
          );
        }
        return (
          <p key={idx} className="text-muted-foreground leading-relaxed mt-4 text-base md:text-lg">
            {text}
          </p>
        );
      });
    }

    return (
      <>
        <p className="text-lg text-slate-800 font-medium leading-relaxed">
          {article.excerpt}
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          The Africa Web3 Institute continues to monitor real-time policy adjustments, market infrastructure developments, and sovereign compliance standards across all regional jurisdictions.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          For full regulatory indices, refer to our comprehensive Africa Web3 Policy & Innovation Index (AWPII) and Regulatory Tracker portals.
        </p>
      </>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back button */}
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        {/* Article header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4A017]/10 text-[#D4A017] font-semibold text-xs">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(article.date)}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
            {article.author && (
              <span className="flex items-center gap-1 text-xs text-slate-600 font-medium ml-auto">
                <User className="w-3.5 h-3.5" /> {article.author}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B1437] leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Featured image */}
        {article.image && (
          <div className="rounded-2xl overflow-hidden mb-8 bg-[#0B1437]">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Article content */}
        <div className="prose prose-lg max-w-none">
          {renderBody()}
        </div>

        {/* Back to list */}
        <div className="mt-12 border-t border-border pt-6 flex items-center justify-between">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4A017] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Browse all articles
          </Link>
          <Link
            to="/blog"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Read Thought Leadership Blog →
          </Link>
        </div>
      </div>
    </div>
  );
}
