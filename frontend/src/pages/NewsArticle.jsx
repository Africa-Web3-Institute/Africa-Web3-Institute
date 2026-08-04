// src/pages/NewsArticle.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { NEWS_DATA } from "./News";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export default function NewsArticle() {
  const { slug } = useParams(); // gets the slug from the URL (e.g., "au-summit-2026")
  const { language } = useLanguage();
  const T = t[language]?.news || {};
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the article that matches the slug
    const found = NEWS_DATA.find((item) => item.slug === slug);
    setArticle(found || null);
    setLoading(false);
  }, [slug]);

  // Show a loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If article not found, show a 404 message
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-3xl font-bold text-secondary mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
        <Link to="/news" className="inline-flex items-center gap-2 text-[#D4A017] font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    );
  }

  // Render the article
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
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4A017]/10 text-[#D4A017] font-medium">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(article.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-secondary leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Featured image */}
        <div className="rounded-2xl overflow-hidden mb-8 bg-[#0B1437]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>

        {/* Article content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            This is the full article content. In a real implementation, you would store the
            full content in the data and render it here.
          </p>
        </div>

        {/* Back to list */}
        <div className="mt-12 border-t border-border pt-6">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4A017] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Browse all articles
          </Link>
        </div>
      </div>
    </div>
  );
}