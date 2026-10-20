import { useLanguage } from "../../lib/LanguageContext";
import { t } from "../../lib/translations";
import { useEffect, useRef, useState } from "react";

const PARTNERS = [
  {
    name: "Smart World Education",
    logo: "/logos/smartworld_logo.png",
    url: "https://www.swedu.me",
  },
  {
    name: "Decentrix Africa",
    logo: "/logos/decentrix_logo.jpg",
    url: "https://decentrix.africa",
  },
  {
    name: "Almstins",
    logo: "/logos/almstins_logo.jpg",
    url: "https://almstins.com",
  },
  {
    name: "aerochainafrica",
    logo: "/logos/aerochain_logo.png",
    url: "https://aerochainafrica.com",
  },
  {
    name: "Nesolearn",
    logo: "/logos/nesolearn.png",
    url: "https://nesolearn.com",
  },
  {
    name: "VAAK",
    logo: "/logos/VAAK.png",
    url: "https://vaak.ke",
  },
];

export default function Partners() {
  const { language } = useLanguage();
  const T = t[language].about;

  const trackRef = useRef(null);
  const wrapperRef = useRef(null);

  const positionRef = useRef(0);
  const animationRef = useRef(null);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startPositionRef = useRef(0);

  const movedRef = useRef(false);
  const resumeTimeoutRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate partners for seamless infinite scrolling
  const items = [...PARTNERS, ...PARTNERS];

  /*
   * Keep the track inside the first/second copy.
   */
  const normalizePosition = () => {
    const track = trackRef.current;

    if (!track) return;

    const halfWidth = track.scrollWidth / 2;

    if (positionRef.current <= -halfWidth) {
      positionRef.current += halfWidth;
    }

    if (positionRef.current > 0) {
      positionRef.current -= halfWidth;
    }
  };

  /*
   * Apply the current position.
   */
  const updatePosition = () => {
    if (!trackRef.current) return;

    trackRef.current.style.transform =
      `translate3d(${positionRef.current}px, 0, 0)`;
  };

  /*
   * Automatic scrolling.
   */
  useEffect(() => {
    const speed = 0.45;

    const animate = () => {
      if (!isDraggingRef.current && !isPaused) {
        positionRef.current -= speed;

        normalizePosition();
        updatePosition();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);

      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [isPaused]);

  /*
   * Pause automatic movement temporarily.
   */
  const pauseAndResume = () => {
    setIsPaused(true);

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 1000);
  };

  /*
   * START DRAG
   */
  const handlePointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) {
      return;
    }

    isDraggingRef.current = true;
    movedRef.current = false;

    setIsDragging(true);
    setIsPaused(true);

    startXRef.current = e.clientX;
    startPositionRef.current = positionRef.current;

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  /*
   * DRAG
   */
  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;

    const delta = e.clientX - startXRef.current;

    // Consider it a drag after moving more than 5px
    if (Math.abs(delta) > 5) {
      movedRef.current = true;
    }

    positionRef.current = startPositionRef.current + delta;

    normalizePosition();
    updatePosition();
  };

  /*
   * END DRAG
   */
  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Pointer capture may already have been released.
    }

    // Resume automatic scrolling after 1 second
    pauseAndResume();
  };

  /*
   * Prevent a dragged card from opening its link.
   */
  const handlePartnerClick = (e) => {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }

    movedRef.current = false;
  };

  /*
   * Desktop hover pause.
   */
  const handleMouseEnter = () => {
    if (!isDraggingRef.current) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isDraggingRef.current) {
      setIsPaused(false);
    }
  };

  return (
    <section className="py-24 lg:py-32 border-b border-border bg-[#F8F9FB] relative overflow-hidden">

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #D4A017 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Background orb */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="inline-block text-xs font-semibold tracking-[0.22em] uppercase mb-4 px-4 py-1.5 border border-[#D4A017]/30 rounded-full text-[#D4A017] bg-[#D4A017]/10">
            {T.partnersTag}
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">
            {T.partnersTitle}
          </h2>

          <p className="text-muted-foreground text-[0.9375rem] max-w-2xl mx-auto">
            {T.partnersSubtitle}
          </p>
        </div>

        {/* Carousel wrapper */}
        <div
          ref={wrapperRef}
          className="relative overflow-hidden select-none"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >

          {/* Animated + draggable track */}
          <div
            ref={trackRef}
            className="flex items-stretch gap-5 w-max py-4"
            style={{
              cursor: isDragging ? "grabbing" : "grab",

              /*
               * VERY IMPORTANT for mobile dragging.
               * This prevents the browser from taking over
               * the horizontal gesture.
               */
              touchAction: "none",

              userSelect: "none",
              WebkitUserSelect: "none",
              willChange: "transform",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {items.map((partner, i) => (
              <a
                key={`${partner.name}-${i}`}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                draggable="false"
                onClick={handlePartnerClick}
                className="
                  shrink-0
                  w-[160px]
                  sm:w-[180px]
                  md:w-[200px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  bg-white
                  rounded-2xl
                  border
                  border-border/60
                  p-5
                  sm:p-6
                  transition-all
                  duration-300
                  group
                  hover:border-[#D4A017]
                  hover:shadow-[0_12px_28px_rgba(212,160,23,0.15)]
                  hover:-translate-y-1
                "
              >
                <div className="w-full h-16 flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    draggable="false"
                    className="
                      max-h-full
                      max-w-full
                      object-contain
                      grayscale-[0.2]
                      brightness-[0.95]
                      transition
                      duration-300
                      group-hover:grayscale-0
                      group-hover:brightness-100
                      pointer-events-none
                    "
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <span
                  className="
                    text-[0.65rem]
                    font-medium
                    text-muted-foreground
                    mt-3
                    pt-2
                    border-t
                    border-border/50
                    w-full
                    text-center
                    truncate
                    opacity-0
                    group-hover:opacity-100
                    transition-all
                    duration-300
                    group-hover:translate-y-0
                    translate-y-2
                  "
                >
                  {partner.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Interaction hint */}
        <p className="text-center text-xs text-muted-foreground mt-5">
          {isDragging
            ? "Release to continue"
            : "Swipe or drag to explore our partners"}
        </p>
      </div>
    </section>
  );
}
