// components/home/ImageCarousel.jsx
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

const SLIDES = {
  en: [
    {
      image: "/Awi_Website1.jpg",
      title: "Shaping Africa's Web3 Policy",
      description: "Research-driven policy recommendations for African governments",
      cta: "Read our reports →",
      link: "/publications"
    },
    {
      image: "/Awi_Website2.jpg",
      title: "Building Local Capacity",
      description: "Training the next generation of African Web3 leaders",
      cta: "Join our programs →",
      link: "/capacity-building"
    },
    {
      image: "/Awi_Website4.jpg",
      title: "Pan-African Collaboration",
      description: "Connecting innovators across 18+ African countries",
      cta: "Join our community →",
      link: "/contact"
    },
    {
      image: "/Awi_Website_pics.jpg",
      title: "Driving Innovation Across Africa",
      description: "Connecting innovators across 18+ African countries",
      cta: "Join our community →",
      link: "/contact"
    }
  ],
  fr: [
    {
    image: "/Awi_Website1.jpg",
      title: "Façonner la politique Web3 de l'Afrique",
      description: "Recommandations politiques basées sur la recherche pour les gouvernements africains",
      cta: "Lire nos rapports →",
      link: "/publications"
    },
    {
     image: "/Awi_Website2.jpg",
      title: "Renforcer les capacités locales",
      description: "Former la prochaine génération de leaders Web3 africains",
      cta: "Rejoindre nos programmes →",
      link: "/capacity-building"
    },
    {
      image: "/Awi_Website4.jpg",
      title: "Collaboration panafricaine",
      description: "Connecter les innovateurs dans plus de 18 pays africains",
      cta: "Rejoindre notre communauté →",
      link: "/contact"
    },
    {
      image: "/Awi_Website_pics.jpg",
      title: "Stimuler l'innovation à travers l'Afrique",
      description: "Connecter les innovateurs dans plus de 18 pays africains",
      cta: "Rejoindre notre communauté →",
      link: "/contact"
    }
  ]
};

export default function ImageCarousel() {
  const { language } = useLanguage();
  const slides = SLIDES[language] || SLIDES.en;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const goToSlide = (index) => {
    setCurrentIndex((prev) => {
      if (index < 0) return slides.length - 1;
      if (index >= slides.length) return 0;
      return index;
    });
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(timerRef.current);
  }, [currentIndex, isPaused, nextSlide]); // Added nextSlide dependency

  return (
    <section 
      className="py-24 lg:py-36 border-b border-border bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#D4A017" }}>
            {language === "fr" ? "Notre Impact Visuel" : "Our Impact in Action"}
          </p>
          <h2 className="font-display text-[2rem] lg:text-[2.5rem] font-bold text-secondary leading-snug">
            {language === "fr" ? "Voir ce que nous faisons" : "See What We Do"}
          </h2>
        </div>

        {/* Carousel wrapper */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl bg-[#0B1437]">
          {/* Slides */}
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full relative">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0B1437]/90 via-[#0B1437]/40 to-transparent" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {slide.title}
                  </h3>
                  <p className="text-white/80 text-base lg:text-lg mb-4 max-w-2xl">
                    {slide.description}
                  </p>
                  <a
                    href={slide.link}
                    className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-lg transition-all hover:shadow-lg"
                    style={{ backgroundColor: "#D4A017", color: "#fff" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#c49216"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#D4A017"}
                  >
                    {slide.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all text-white z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all text-white z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="transition-all"
                aria-label={`Go to slide ${index + 1}`}
              >
                <Circle
                  className={`w-2.5 h-2.5 transition-all ${
                    index === currentIndex ? "fill-[#D4A017] text-[#D4A017]" : "fill-white/40 text-white/40 hover:fill-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}