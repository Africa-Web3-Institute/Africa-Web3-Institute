// src/pages/News.js
import { useState, useMemo, useEffect, useRef } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  Filter,
  X,
  FileText,
  Video,
  Mic,
} from "lucide-react";

// ─── Scroll reveal hook ──────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// ─── Reusable animated section wrapper ──────────────────────────────────────
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ─── Sample News Data ──────────────────────────────────────────────────────
// TODO: Replace this with data from your CMS or API
export const NEWS_DATA = [
  {
    id: 1,
    title: "Africa Web3 Institute Launches Groundbreaking Policy Index",
    excerpt:
      "The AWPII (Africa Web3 Policy & Innovation Index) is the first comprehensive framework for evaluating Web3 readiness across 18+ African nations.",
    category: "Research",
    type: "article",
    date: "2026-07-20",
    readTime: "5 min read",
    image:
      "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png",
    slug: "awpii-launch",
    featured: true,
  },
  {
    id: 2,
    title: "Delivering Policy Recommendations at the AU Summit",
    excerpt:
      "Our team presented key findings on digital asset regulation to the African Union's digital economy working group.",
    category: "Policy",
    type: "article",
    date: "2026-07-15",
    readTime: "4 min read",
    image:
      "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png",
    slug: "au-summit-2026",
    featured: false,
  },
  {
    id: 3,
    title: "Web3 Capacity Building Workshop for Central Banks",
    excerpt:
      "AWI facilitated a two-day intensive workshop for 12 central bank officials on stablecoin regulation and CBDC implications.",
    category: "Education",
    type: "article",
    date: "2026-07-10",
    readTime: "3 min read",
    image:
      "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png",
    slug: "central-bank-workshop",
    featured: false,
  },
  {
    id: 4,
    title: "AWI Executive Director Speaks at Binance Blockchain Week",
    excerpt:
      "Afrikanus Kofi Akosah Adusei shared the stage with global leaders to discuss Africa's role in the future of decentralized finance.",
    category: "Events",
    type: "video",
    date: "2026-07-05",
    readTime: "2 min read",
    image:
      "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png",
    slug: "binance-blockchain-week",
    featured: false,
  },
  {
    id: 5,
    title: "The Indaba Series: Inaugural Policy Dialogue in Nairobi",
    excerpt:
      "AWI's flagship policy engagement programme brought together regulators, industry leaders, and academics for a landmark dialogue.",
    category: "Events",
    type: "article",
    date: "2026-06-28",
    readTime: "6 min read",
    image:
      "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png",
    slug: "indaba-series-nairobi",
    featured: false,
  },
  {
    id: 6,
    title: "Francophone Web3 Student Network Launches in Abidjan",
    excerpt:
      "The new network aims to connect French-speaking African students and young professionals with opportunities in the Web3 ecosystem.",
    category: "Community",
    type: "article",
    date: "2026-06-20",
    readTime: "4 min read",
    image:
      "https://media.base44.com/images/public/69f0c79c7957f32b49dcc978/1d0e1310d_African_Web3_Think_Tank.png",
    slug: "francophone-network-launch",
    featured: false,
  },
];

// ─── Helper Functions ──────────────────────────────────────────────────────
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const getCategories = (data) => {
  const categories = new Set(data.map((item) => item.category));
  return ["All", ...Array.from(categories)];
};

// ─── News Card Component ──────────────────────────────────────────────────
const NewsCard = ({ item, featured = false }) => {
  const [hovered, setHovered] = useState(false);

  const typeIcon = {
    article: <FileText className="w-3.5 h-3.5" />,
    video: <Video className="w-3.5 h-3.5" />,
    podcast: <Mic className="w-3.5 h-3.5" />,
  }[item.type] || <FileText className="w-3.5 h-3.5" />;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group bg-white rounded-2xl overflow-hidden border border-border transition-all duration-300 ${
        featured ? "md:flex" : ""
      } ${hovered ? "shadow-xl border-[#D4A017]/30" : "shadow-sm"}`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-[#0B1437] ${
          featured ? "md:w-2/5 md:shrink-0" : "w-full aspect-[16/9]"
        }`}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[0.65rem] font-medium">
          {typeIcon}
          <span className="capitalize">{item.type}</span>
        </div>
        {item.featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#D4A017] text-white text-[0.65rem] font-bold uppercase tracking-wider">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-6 ${featured ? "md:w-3/5 md:p-8" : ""}`}>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-[#D4A017]/10 text-[#D4A017] font-medium">
            {item.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(item.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.readTime}
          </span>
        </div>

        <Link to={`/news/${item.slug}`} className="block">
          <h3
            className={`font-bold text-secondary hover:text-[#D4A017] transition-colors ${
              featured ? "text-2xl md:text-3xl" : "text-xl"
            } mb-2 leading-tight`}
          >
            {item.title}
          </h3>
        </Link>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {item.excerpt}
        </p>

        <Link
          to={`/news/${item.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#D4A017] hover:gap-2 transition-all"
        >
          Read More <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function News() {
  const { language } = useLanguage();
  const T = t[language]?.news || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => getCategories(NEWS_DATA), []);

  const filteredNews = useMemo(() => {
    return NEWS_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredNews = filteredNews.find((item) => item.featured);
  const regularNews = filteredNews.filter((item) => !item.featured);

  return (
    <div className="bg-white text-foreground overflow-hidden">
      {/* ─── HERO SECTION ───────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[55vh] flex items-center overflow-hidden"
        style={{ backgroundColor: "#0B1437" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/news-hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            // backgroundAttachment: "fixed", // uncomment for parallax
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(11, 20, 55, 0.1) 0%,
                rgba(11, 20, 55, 0.5) 40%,
                rgba(11, 20, 55, 0.85) 80%,
                rgba(11, 20, 55, 0.95) 100%
              )
            `,
          }}
        />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gold accent line */}
        <div
          className="absolute left-0 top-1/4 w-1.5 h-32 bg-[#D4A017] hidden md:block"
          style={{ boxShadow: "0 0 30px rgba(212,160,23,0.3)" }}
        />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full z-10">
          <div className="max-w-3xl">
            <AnimatedSection>
              <p
                className="inline-block text-xs font-semibold tracking-[0.18em] uppercase mb-4 px-5 py-1.5 rounded-full text-[#D4A017] bg-[#D4A017]/15 backdrop-blur-sm border border-[#D4A017]/40"
                style={{ boxShadow: "0 0 20px rgba(212,160,23,0.15)" }}
              >
                {T.tag || "News & Insights"}
              </p>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
                {T.title || "Latest News &"}
                <br className="hidden sm:block" />
                <span className="text-[#D4A017] drop-shadow-lg">
                  {T.highlight || "Expert Insights"}
                </span>
              </h1>

              <p className="text-lg text-white/80 leading-relaxed max-w-xl backdrop-blur-[2px] p-4 -ml-4 rounded-xl">
                {T.subtitle ||
                  "Discover the latest updates, expert opinions, and in-depth analysis shaping the future of Web3 policy in Africa."}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/newsletter"
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4A017] text-white font-semibold rounded-full hover:bg-[#b88a12] transition-all shadow-lg shadow-[#D4A017]/25 hover:shadow-[#D4A017]/40 hover:-translate-y-0.5"
                >
                  Subscribe to Newsletter
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── FILTERS & SEARCH ────────────────────────────────────────────── */}
      <section className="py-6 border-b border-border bg-[#F8F9FB] sticky top-0 z-40 backdrop-blur-md bg-[#F8F9FB]/90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-[#D4A017] text-white shadow-md shadow-[#D4A017]/25"
                      : "bg-white text-muted-foreground hover:text-secondary border border-border hover:border-[#D4A017]/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A017]/30 focus:border-[#D4A017] transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWS GRID ────────────────────────────────────────────────────── */}
      <section className="py-12 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No articles found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 text-[#D4A017] font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {featuredNews && (
                <AnimatedSection>
                  <NewsCard item={featuredNews} featured />
                </AnimatedSection>
              )}
              {regularNews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularNews.map((item, index) => (
                    <AnimatedSection key={item.id} delay={index * 75}>
                      <NewsCard item={item} />
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── SUBSCRIBE CTA ────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="bg-[#0B1437] rounded-3xl p-10 md:p-14 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {T.ctaTitle || "Never Miss an Update"}
              </h2>
              <p className="text-white/70 leading-relaxed mb-6 max-w-xl mx-auto">
                {T.ctaText ||
                  "Subscribe to our newsletter for the latest policy briefs, research reports, and event announcements."}
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-full border-0 focus:ring-2 focus:ring-[#D4A017] text-sm"
                  required
                />
                <Link
                  to="/newsletter"
                  onClick={scrollToTop}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D4A017] text-white font-semibold hover:bg-[#b88a12] transition-colors shadow-lg shadow-[#D4A017]/25"
                >
                  Subscribe <ArrowRight className="w-4 h-4" />
                </Link>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── BACK TO HOME ───────────────────────────────────────────────────── */}
      <div className="border-t border-border py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors"
          >
            ← {T.backHome || "Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}