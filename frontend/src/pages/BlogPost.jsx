// src/pages/BlogPost.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Copy,
  Check,
  BookOpen,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const XIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.53-1.53A1.53 1.53 0 0 0 6.46 5.7a1.53 1.53 0 0 0-1.53 1.53c0 .85.68 1.53 1.53 1.53m1.4 9.74v-8.37H5.06v8.37h2.8z" />
  </svg>
);
import { useLanguage } from "../lib/LanguageContext";
import { blogsApi } from "../api/api";
import BlockRenderer from "../components/BlockRenderer";
import { parseContent } from "../lib/blocks";

const FALLBACK_BLOGS = {
  "rise-of-stablecoins-african-cross-border-trade": {
    id: 1,
    title: "The Rise of Stablecoins in African Trade: Beyond the Hype",
    slug: "rise-of-stablecoins-african-cross-border-trade",
    category: "Stablecoins",
    tag: "Trade & Payments",
    author: "Dr. Kwame Mensah",
    authorTitle: "Senior Research Fellow, Macroeconomics & Payments",
    date: "2026-08-14",
    readTime: "7 min read",
    image: "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png",
    excerpt: "How USD-pegged tokens have quietly replaced correspondent banking corridors across Lagos, Nairobi, and Johannesburg, and what policymakers need to do next.",
    content: `## The Quiet Shift in African Wholesale Liquidity

While global crypto discourse remains fixated on speculative retail cycles and token volatility, African commercial enterprises have enacted a profound infrastructural pivot. Across major trade corridors—connecting Lagos with Guangzhou, Nairobi with Dubai, and Johannesburg with regional Southern African Development Community (SADC) partners—commercial importers and trade intermediaries are actively routing transactions through USD-backed stablecoins.

This is not ideological adoption; it is an acute, pragmatic response to structural frictions within traditional correspondent banking:

1. **Foreign Exchange Rationing:** Central bank rationing and restricted allocations of physical US Dollars force legitimate import-export businesses onto parallel markets where delays extend into weeks.
2. **Punitive FX Spreads:** Correspondent bank routing often extracts between 4% and 9% in layered transfer fees and currency conversions across multiple jurisdictions.
3. **Settlement Latency:** Conventional SWIFT transfers across intra-African borders frequently take 3 to 7 business days to finalize.

By contrast, asset-backed stablecoins settle across low-cost Layer-2 and Layer-1 protocols in sub-second timeframes with predictable nominal fees.

---

## The Policy Dilemma: Capital Flight vs. Trade Efficiency

Central banks across the continent face an unprecedented balancing act. On one hand, uncontrolled stablecoin outflows reduce national visibility over capital accounts and challenge the efficacy of monetary policy transmission. On the other hand, heavy-handed blanket prohibitions do not eliminate stablecoin velocity; they merely push transaction flows underground into peer-to-peer (P2P) desks and informal OTC networks, depriving authorities of tax revenues and compliance oversight.

> "A regulatory framework that attempts to prohibit private stablecoins without addressing the underlying correspondent banking deficit is treating the symptom while exacerbating the illness." — AWI Macro Research Group

### Three Strategic Imperatives for African Regulators:

* **Tiered VASP Licensing:** Establish clear, risk-proportionate licensing criteria for Virtual Asset Service Providers (VASPs) facilitating trade remittances, mandating 1:1 verified reserve auditing.
* **Interoperability with National Fast Payment Systems:** Central banks should facilitate regulated fiat gateways connecting local instant-payment switches (e.g., NIBSS in Nigeria, TIPS/PesaLink in East Africa) to compliant digital asset on-ramps.
* **Empirical On-Chain Monitoring:** Transition from post-facto reporting to automated, continuous on-chain intelligence tools that distinguish between speculative transfers and genuine commercial trade flows.

---

## Conclusion: The Path Forward

Africa does not need to copy European or American regulatory models verbatim. By constructing bespoke, forward-looking frameworks that acknowledge stablecoins as supplementary trade liquidity instruments while safeguarding sovereign reserves, African policymakers can position their jurisdictions as global pioneers in institutional digital finance.`
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
};

export default function BlogPost() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const isFr = language === "fr";

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    blogsApi
      .getBySlug(slug)
      .then((res) => {
        if (!mounted) return;
        const item = res?.data || res;
        if (item && item.title) {
          setPost(item);
        } else if (FALLBACK_BLOGS[slug]) {
          setPost(FALLBACK_BLOGS[slug]);
        }
      })
      .catch(() => {
        if (!mounted) return;
        if (FALLBACK_BLOGS[slug]) {
          setPost(FALLBACK_BLOGS[slug]);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Read "${post?.title}" by Africa Web3 Institute`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareLinkedin = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#D4A017] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">
            {isFr ? "Chargement de l'analyse..." : "Loading thought leadership essay..."}
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 bg-white">
        <BookOpen className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-[#0B1437] mb-2">
          {isFr ? "Article introuvable" : "Essay Not Found"}
        </h2>
        <p className="text-slate-500 text-sm max-w-md text-center mb-6">
          {isFr
            ? "L'analyse que vous recherchez n'existe pas ou a été déplacée."
            : "The thought leadership essay you are looking for does not exist or has been moved."}
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B1437] text-white text-xs font-bold hover:bg-[#D4A017] hover:text-[#0B1437] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {isFr ? "Retour aux analyses" : "Back to Blog"}
        </Link>
      </div>
    );
  }

  // Admin posts are saved as blocks; older posts are plain text. parseContent understands both.
  const renderContent = (contentStr) => {
    const blocks = parseContent(contentStr);
    return <BlockRenderer blocks={blocks.length ? blocks : parseContent(post.excerpt)} />;
  };

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      {/* ─── BREADCRUMB & HEADER ───────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-200/80 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link to="/blog" className="hover:text-slate-900 transition-colors">
              {isFr ? "Analyses" : "Blog"}
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-none">
              {post.category || "Essay"}
            </span>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0B1437] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {isFr ? "Toutes les analyses" : "All Essays"}
          </Link>
        </div>
      </section>

      {/* ─── ARTICLE HEADER ─────────────────────────────────────── */}
      <header className="max-w-4xl mx-auto px-6 pt-10 pb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4A017]/15 text-[#b8891a]">
            {post.category || "Policy"}
          </span>
          {post.tag && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              {post.tag}
            </span>
          )}
          <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime || "6 min read"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1437] leading-tight mb-6">
          {post.title}
        </h1>

        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 text-base leading-relaxed mb-8 italic">
          {post.excerpt}
        </div>

        {/* Author & Share Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#0B1437] text-white flex items-center justify-center font-bold text-base">
              {post.author ? post.author.charAt(0) : "A"}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">
                {post.author}
              </p>
              <p className="text-xs text-slate-500">
                {post.authorTitle || "Research Fellow, Africa Web3 Institute"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-2">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.date)}
            </span>

            {/* Social Share buttons */}
            <button
              onClick={shareTwitter}
              title="Share on X"
              className="p-2 rounded-full border border-slate-200 text-slate-600 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>
            <button
              onClick={shareLinkedin}
              title="Share on LinkedIn"
              className="p-2 rounded-full border border-slate-200 text-slate-600 hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors"
            >
              <LinkedinIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              title="Copy link"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#D4A017] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ───────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 pb-16">
        <article className="prose prose-slate max-w-none">
          {renderContent(post.content)}
        </article>

        {/* Author Bio Box */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="w-14 h-14 rounded-full bg-[#0B1437] text-white flex-shrink-0 flex items-center justify-center font-bold text-xl">
            {post.author ? post.author.charAt(0) : "A"}
          </div>
          <div>
            <h4 className="text-base font-bold text-[#0B1437] mb-1">
              {post.author}
            </h4>
            <p className="text-xs text-[#b8891a] font-semibold mb-2">
              {post.authorTitle || "Africa Web3 Institute Fellow"}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Contributing research and sovereign economic analysis across decentralized finance, CBDCs, and regulatory modernization in Africa.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0B1437] hover:text-[#b8891a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isFr ? "Retour aux analyses de l'Institut" : "Back to All Research & Essays"}
          </Link>
          <Link
            to="/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            {isFr ? "Voir les actualités" : "Browse News & Press"}
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
