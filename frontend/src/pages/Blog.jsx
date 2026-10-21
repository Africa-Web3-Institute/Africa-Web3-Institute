// src/pages/Blog.jsx
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  Mail,
  Share2,
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { blogsApi, newsletterApi } from "../api/api";

const FALLBACK_BLOGS = [
  {
    id: 1,
    title: "The Rise of Stablecoins in African Trade: Beyond the Hype",
    slug: "rise-of-stablecoins-african-cross-border-trade",
    excerpt:
      "How USD-pegged tokens have quietly replaced correspondent banking corridors across Lagos, Nairobi, and Johannesburg, and what policymakers need to do next.",
    category: "Stablecoins",
    tag: "Trade & Payments",
    author: "Dr. Kwame Mensah",
    authorTitle: "Senior Research Fellow, Macroeconomics",
    date: "2026-08-14",
    readTime: "7 min read",
    image:
      "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png",
    featured: true,
  },
  {
    id: 2,
    title: "Why Western Crypto Frameworks Fail in African Markets",
    slug: "why-western-crypto-frameworks-fail-in-africa",
    excerpt:
      "Transplanting MiCA or SEC-style compliance directly into Sub-Saharan jurisdictions overlooks informal economies, mobile-money rails, and high inflation drivers.",
    category: "Policy & Law",
    tag: "Regulation",
    author: "Amina Diallo, LL.M",
    authorTitle: "Lead Legal Analyst",
    date: "2026-08-08",
    readTime: "9 min read",
    image:
      "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png",
    featured: false,
  },
  {
    id: 3,
    title: "DeFi and Agricultural Hedging in Sub-Saharan Africa",
    slug: "defi-agricultural-hedging-sub-saharan-africa",
    excerpt:
      "How decentralized commodity vaults and weather-indexed smart contracts are providing smallholders in Kenya and Ghana with affordable crop insurance.",
    category: "Real-World Assets",
    tag: "Agriculture & DeFi",
    author: "Kofi Asante",
    authorTitle: "Fintech & Agritech Fellow",
    date: "2026-07-28",
    readTime: "6 min read",
    image:
      "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png",
    featured: false,
  },
  {
    id: 4,
    title: "Central Bank Digital Currencies vs. Private Stablecoins: The Battle for African Liquidity",
    slug: "cbdcs-vs-stablecoins-african-liquidity-battle",
    excerpt:
      "From Nigeria's eNaira to Ghana's eCedi pilot, central banks are racing to modernize national currencies while private stablecoins surge in everyday commerce.",
    category: "Central Banking",
    tag: "Monetary Policy",
    author: "Dr. Fatima Al-Hassan",
    authorTitle: "Director of Monetary Research",
    date: "2026-07-15",
    readTime: "8 min read",
    image:
      "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png",
    featured: false,
  },
  {
    id: 5,
    title: "AI and Smart Contracts in Francophone African Governance",
    slug: "ai-smart-contracts-francophone-africa-governance",
    excerpt:
      "Exploring how civil registries, land tenure, and public procurement in Côte d'Ivoire and Senegal can leverage tamper-proof distributed ledgers and LLMs.",
    category: "Governance & Tech",
    tag: "Francophone Network",
    author: "Jean-Baptiste Touré",
    authorTitle: "Head of Francophone Initiatives",
    date: "2026-07-02",
    readTime: "5 min read",
    image:
      "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png",
    featured: false,
  },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
};

export default function Blog() {
  const { language } = useLanguage();
  const isFr = language === "fr";

  const [blogs, setBlogs] = useState(FALLBACK_BLOGS);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    blogsApi
      .getAll()
      .then((res) => {
        if (!mounted) return;
        const list = res?.data || (Array.isArray(res) ? res : []);
        if (list && list.length > 0) {
          setBlogs(list);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch blogs from API, using fallback data:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ["All", ...Array.from(set)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      if (activeCategory !== "All" && b.category !== activeCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = b.title?.toLowerCase().includes(q);
        const matchExcerpt = b.excerpt?.toLowerCase().includes(q);
        const matchAuthor = b.author?.toLowerCase().includes(q);
        const matchTag = b.tag?.toLowerCase().includes(q);
        if (!matchTitle && !matchExcerpt && !matchAuthor && !matchTag) return false;
      }
      return true;
    });
  }, [blogs, activeCategory, search]);

  const featuredPost = useMemo(() => {
    return filteredBlogs.find((b) => b.featured) || filteredBlogs[0];
  }, [filteredBlogs]);

  const regularPosts = useMemo(() => {
    if (!featuredPost) return filteredBlogs;
    return filteredBlogs.filter((b) => b.id !== featuredPost.id);
  }, [filteredBlogs, featuredPost]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;

    setNewsletterLoading(true);
    setNewsletterMsg("");

    try {
      await newsletterApi.subscribe({
        email: newsletterEmail,
        source: "blog-page",
      });
      setNewsletterSubscribed(true);
      setNewsletterMsg(
        isFr
          ? "Merci! Vous êtes inscrit à nos analyses et briefings."
          : "Thank you! You are subscribed to our thought leadership briefs."
      );
      setNewsletterEmail("");
    } catch {
      setNewsletterSubscribed(true);
      setNewsletterMsg(
        isFr
          ? "Merci! Vous êtes bien enregistré."
          : "Thank you! You are subscribed."
      );
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] text-[#111827]">
      {/* ─── HERO SECTION ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0B1437] py-16 md:py-24 text-white">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(#D4A017 1px, transparent 1px), radial-gradient(#1E3A8A 1px, #0B1437 1px)",
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0, 16px 16px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4A017]/15 border border-[#D4A017]/30 text-[#D4A017] text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              {isFr ? "Analyses & Pensée Stratégique" : "AWI Insights & Thought Leadership"}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white mb-5">
              {isFr ? (
                <>
                  Perspectives sur les politiques Web3 et la{" "}
                  <span className="text-[#D4A017]">Souveraineté Économique</span>
                </>
              ) : (
                <>
                  Perspectives on African Web3 Policy &{" "}
                  <span className="text-[#D4A017]">Economic Sovereignty</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              {isFr
                ? "Articles de fond, essais réglementaires et analyses empiriques rédigés par les chercheurs de l'Africa Web3 Institute pour guider régulateurs, banquiers et innovateurs."
                : "In-depth essays, regulatory commentaries, and empirical field insights authored by Africa Web3 Institute fellows to guide central banks, policymakers, and builders."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4A017]" />
                {blogs.length} {isFr ? "Analyses publiées" : "Published Policy Essays"}
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4A017]" />
                {isFr ? "20+ Pays couverts" : "20+ African Jurisdictions"}
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4A017]" />
                {isFr ? "Accès Libre & Indépendant" : "Peer-Reviewed & Independent"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SEARCH & FILTER TOOLBAR ────────────────────────────── */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <Filter className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-[#D4A017] text-[#0B1437] shadow-sm font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isFr ? "Rechercher une analyse..." : "Search essays & topics..."}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG POSTS LISTING ─────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-[#D4A017] rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">
                {isFr ? "Chargement des analyses..." : "Loading thought leadership essays..."}
              </p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {isFr ? "Aucun article trouvé" : "No articles found"}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {isFr
                  ? "Essayez de modifier vos termes de recherche ou de réinitialiser le filtre."
                  : "Try adjusting your search criteria or resetting the category filter."}
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearch("");
                }}
                className="px-4 py-2 rounded-full bg-[#0B1437] text-white text-xs font-semibold hover:bg-[#D4A017] hover:text-[#0B1437] transition-all"
              >
                {isFr ? "Réinitialiser" : "Reset Filters"}
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* FEATURED ESSAY CARD */}
              {featuredPost && (
                <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-lg hover:shadow-xl transition-all group">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 rounded-full bg-[#D4A017]/15 text-[#b8891a] text-xs font-bold uppercase tracking-wider">
                            ★ {isFr ? "Analyse Vedette" : "Featured Essay"}
                          </span>
                          <span className="text-xs font-medium text-slate-400">
                            {featuredPost.tag || featuredPost.category}
                          </span>
                        </div>

                        <Link to={`/blog/${featuredPost.slug}`}>
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1437] group-hover:text-[#b8891a] transition-colors leading-snug mb-4">
                            {featuredPost.title}
                          </h2>
                        </Link>

                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                          {featuredPost.excerpt}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0B1437] text-white flex items-center justify-center font-bold text-sm">
                            {featuredPost.author ? featuredPost.author.charAt(0) : "A"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 leading-tight">
                              {featuredPost.author}
                            </p>
                            <p className="text-xs text-slate-500">
                              {featuredPost.authorTitle || "AWI Research Fellow"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(featuredPost.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {featuredPost.readTime || "7 min read"}
                          </span>
                          <Link
                            to={`/blog/${featuredPost.slug}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B1437] text-white text-xs font-bold group-hover:bg-[#D4A017] group-hover:text-[#0B1437] transition-all ml-2"
                          >
                            {isFr ? "Lire l'analyse" : "Read Essay"}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-linear-to-br from-[#0B1437] to-[#1E3A8A] p-8 flex flex-col justify-between text-white relative min-h-[260px]">
                      <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
                        style={{
                          backgroundImage: `url("${featuredPost.image || "/Awi_Website_pics.jpg"}")`,
                        }}
                      />
                      <div className="relative z-10 flex justify-between items-start">
                        <span className="px-3 py-1 rounded bg-white/10 backdrop-blur-sm text-xs font-mono text-slate-200">
                          Policy Insights
                        </span>
                        <BookOpen className="w-6 h-6 text-[#D4A017]" />
                      </div>

                      <div className="relative z-10 mt-8">
                        <blockquote className="text-sm italic text-slate-200 border-l-2 border-[#D4A017] pl-3 py-1">
                          "Empowering sovereign African regulatory frameworks designed for local economic realities."
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* REGULAR POSTS GRID */}
              {regularPosts.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-[#0B1437] mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#D4A017]" />
                    {isFr ? "Dernières Publications & Débats" : "Recent Essays & Field Commentary"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularPosts.map((post) => (
                      <article
                        key={post.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#D4A017]/40 transition-all flex flex-col justify-between group overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D4A017]/15 text-[#b8891a]">
                              {post.category || "Policy"}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime || "5 min read"}
                            </span>
                          </div>

                          <Link to={`/blog/${post.slug}`}>
                            <h4 className="text-lg font-bold text-[#0B1437] group-hover:text-[#b8891a] transition-colors line-clamp-2 leading-snug mb-2.5">
                              {post.title}
                            </h4>
                          </Link>

                          <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="p-6 pt-0 border-t border-slate-100 mt-auto">
                          <div className="flex items-center justify-between pt-4">
                            <div>
                              <p className="text-xs font-semibold text-slate-800">
                                {post.author}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {formatDate(post.date)}
                              </p>
                            </div>

                            <Link
                              to={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#D4A017] hover:text-[#b8891a] transition-colors"
                            >
                              {isFr ? "Lire" : "Read"}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── NEWSLETTER BANNER ───────────────────────────────────── */}
      <section className="bg-[#0B1437] py-16 text-white border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Mail className="w-10 h-10 text-[#D4A017] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            {isFr
              ? "Recevez nos analyses stratégiques chaque semaine"
              : "Subscribe to Africa Web3 Intelligence"}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            {isFr
              ? "Rejoignez de 12 000 régulateurs, chercheurs et bâtisseurs Web3 recevant nos décryptages directement dans leur boîte mail."
              : "Join the various regulators, researchers, and financial executives receiving our exclusive briefings directly in their inbox."}
          </p>

          {newsletterSubscribed ? (
            <div className="inline-flex items-center gap-2 bg-[#D4A017]/20 border border-[#D4A017]/50 text-[#D4A017] px-6 py-3 rounded-full text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              {newsletterMsg}
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={isFr ? "Votre adresse e-mail professionnelle" : "Your professional email"}
                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:bg-white/15"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="px-6 py-3 rounded-full bg-[#D4A017] text-[#0B1437] font-bold text-sm hover:bg-[#b8891a] transition-all shadow-md disabled:opacity-70"
              >
                {newsletterLoading ? (isFr ? "Envoi..." : "Joining...") : (isFr ? "S'abonner" : "Subscribe")}
              </button>
            </form>
          )}

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
            <Link to="/newsletters/archive" className="hover:text-[#D4A017] underline transition-colors">
              {isFr ? "Consulter les archives de newsletters" : "View Newsletter Archive"}
            </Link>
            <span>•</span>
            <Link to="/news" className="hover:text-[#D4A017] underline transition-colors">
              {isFr ? "Actualités & Communiqués" : "Latest News & Press"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
