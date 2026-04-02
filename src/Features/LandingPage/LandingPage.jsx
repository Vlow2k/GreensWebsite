import { useRef, useCallback, useMemo, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useInView,
  animate,
} from "framer-motion";
// TODO: Host video on external CDN and load from URL
// import heroVideo from "../../Files/Video/gse-video-raw-file.mp4";

/* ─────────────────────────────────────────────────────────────
   BRAND
───────────────────────────────────────────────────────────── */
const BRAND = "#9cc72b"; // Green - company color

/* ─────────────────────────────────────────────────────────────
   DETERMINISTIC BUILDING GRID
───────────────────────────────────────────────────────────── */
const GRID = 8;
const GAP = 1.12;

const BUILDINGS = Array.from({ length: GRID }, (_, r) =>
  Array.from({ length: GRID }, (_, c) => ({
    x: (c - (GRID - 1) / 2) * GAP,
    z: (r - (GRID - 1) / 2) * GAP,
    h: Math.abs(Math.sin(r * 2.1 + c * 1.7)) * 2.6 + 0.35,
    delay: (r + c) * 0.22,
  }))
).flat();

/* ─────────────────────────────────────────────────────────────
   3D ─ WIREFRAME BUILDING
───────────────────────────────────────────────────────────── */
function Building({ x, z, h, delay }) {
  const bobRef = useRef();

  const lines = useMemo(() => {
    const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.62, h, 0.62));
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(BRAND),
      transparent: true,
      opacity: 0.68,
    });
    return new THREE.LineSegments(geo, mat);
  }, [h]);

  useFrame(({ clock }) => {
    if (!bobRef.current) return;
    bobRef.current.position.y =
      Math.sin(clock.elapsedTime * 0.38 + delay) * 0.065;
  });

  return (
    <group position={[x, h / 2, z]}>
      <group ref={bobRef}>
        <mesh>
          <boxGeometry args={[0.62, h, 0.62]} />
          <meshStandardMaterial
            color={BRAND}
            transparent
            opacity={0.04}
            depthWrite={false}
          />
        </mesh>
        <primitive object={lines} />
      </group>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   3D ─ CITY GRID + MOUSE PARALLAX
───────────────────────────────────────────────────────────── */
function CityGrid({ mouse }) {
  const groupRef = useRef();
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      0.22 + mouse.current.x * 0.14,
      0.03
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -0.28 + mouse.current.y * 0.09,
      0.03
    );
  });
  return (
    <group ref={groupRef}>
      {BUILDINGS.map((b, i) => (
        <Building key={i} {...b} />
      ))}
    </group>
  );
}

function Scene({ mouse }) {
  return (
    <>
      <fog attach="fog" args={["#ffffff", 14, 32]} />
      <ambientLight intensity={0.2} />
      <pointLight
        position={[0, 6, 0]}
        intensity={4}
        color={BRAND}
        distance={20}
        decay={2}
      />
      <pointLight
        position={[5, 2, 5]}
        intensity={1.5}
        color="#ffffff"
        distance={15}
        decay={2}
      />
      <Environment preset="city" />
      <CityGrid mouse={mouse} />
      <Sparkles
        count={60}
        scale={12}
        size={0.7}
        speed={0.12}
        opacity={0.4}
        color={BRAND}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   UI ─ DOT NAVIGATION
───────────────────────────────────────────────────────────── */
const SECTION_LABELS = [
  "Home",
  "Overview",
  "Portfolio",
  "Services",
  "About",
  "Contact",
];

function DotNav({ active, onDotClick }) {
  return (
    <div className="fixed right-7 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-[14px]">
      {SECTION_LABELS.map((label, i) => (
        <div key={label} className="flex items-center gap-3 group justify-end">
          {/* Label */}
          <span
            className="text-[10px] font-semibold tracking-[0.18em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none"
            style={{ color: i === active ? BRAND : "rgba(0,0,0,0.45)" }}
          >
            {label}
          </span>
          {/* Dot / bar */}
          <button
            onClick={() => onDotClick(i)}
            aria-label={`Go to ${label}`}
            className="rounded-full transition-all duration-300 shrink-0"
            style={{
              width: i === active ? 22 : 6,
              height: 6,
              background: i === active ? BRAND : "rgba(0,0,0,0.22)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   UI ─ ANIMATED COUNTER
───────────────────────────────────────────────────────────── */
function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1.6,
  grouping = true,
}) {
  const ref = useRef(null);
  const motionVal = useMotionValue(0);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(motionVal, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) =>
        setDisplay(
          grouping
            ? Math.round(v).toLocaleString("en-US")
            : Math.round(v).toString()
        ),
    });
    return ctrl.stop;
  }, [inView, to, duration, motionVal]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   UI ─ EYEBROW
───────────────────────────────────────────────────────────── */
function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-6 h-px shrink-0" style={{ background: BRAND }} />
      <span
        className="text-[11px] font-bold tracking-[0.28em] uppercase"
        style={{ color: BRAND }}
      >
        {children}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const STATS = [
  {
    prefix: "",
    value: 1958,
    suffix: "",
    label: "Year Founded",
    grouping: false,
  },
  {
    prefix: "$",
    value: 2,
    suffix: "B+",
    label: "Assets Under Management",
    grouping: true,
  },
  {
    prefix: "",
    value: 40,
    suffix: "+",
    label: "Properties Managed",
    grouping: true,
  },
  { prefix: "", value: 3, suffix: "", label: "Continents", grouping: true },
];

const FEATURED = [
  {
    name: "Greens Storage",
    location: "Escondido, CA",
    tag: "Self-Storage",
    detail: "110,000 sq ft · 2023",
    desc: "Brand-new Class-A facility in North San Diego County. Fully-enclosed RV units with 15-ft doors, state-of-the-art surveillance, and 38–60 ft drive aisles.",
  },
  {
    name: "Genopolis",
    location: "Hyderabad, India",
    tag: "Life Sciences",
    detail: "Research Campus · Active",
    desc: "World-class life sciences and innovation campus supporting next-generation pharmaceutical and biotech research in one of India's fastest-growing metros.",
  },
  {
    name: "CubeSmart",
    location: "Austin, TX",
    tag: "REIT Partnership",
    detail: "Class A · Active",
    desc: "Premium self-storage asset in the high-growth Austin metropolitan market, operated in strategic partnership with the CubeSmart REIT platform.",
  },
];

const SERVICES = [
  {
    n: "01",
    title: "Self-Storage Development",
    desc: "Ground-up development and acquisition of Class-A self-storage facilities in high-growth U.S. markets with full operational management.",
  },
  {
    n: "02",
    title: "Retail Real Estate",
    desc: "Strategic retail property investments focused on essential services, high-traffic corridors, and long-term NNN lease structures.",
  },
  {
    n: "03",
    title: "Healthcare & Life Sciences",
    desc: "Development of specialized research campuses, medical office buildings, and life sciences infrastructure for global operators.",
  },
  {
    n: "04",
    title: "Hospitality Investments",
    desc: "Hospitality asset management targeting select-service and boutique hotel properties in key metropolitan markets.",
  },
];

/* ─────────────────────────────────────────────────────────────
   ANIMATION PRESETS
───────────────────────────────────────────────────────────── */
const inViewFadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
};
const inViewFadeLeft = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.35 },
};
const inViewFadeRight = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.35 },
};
const staggerContainer = {
  whileInView: "show",
  initial: "hidden",
  viewport: { once: true, amount: 0.2 },
  variants: {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  },
};
const staggerItem = {
  variants: {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  },
};

const T = { duration: 0.75, ease: [0.22, 1, 0.36, 1] };
const CARD_HOVER = {
  y: -7,
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
};
const CARD_TAP = { scale: 0.995 };
const FOOTER_STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
};
const FOOTER_ITEM = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  /* ── Section refs for dot nav ── */
  const heroRef = useRef(null);
  const overviewRef = useRef(null);
  const portfolioRef = useRef(null);
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const sectionRefs = [
    heroRef,
    overviewRef,
    portfolioRef,
    servicesRef,
    aboutRef,
    contactRef,
  ];
  const [activeSection, setActiveSection] = useState(0);

  /* ── Intersection observer → active dot ── */
  useEffect(() => {
    const observers = sectionRefs.map((ref, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(i);
        },
        { threshold: 0.5 }
      );
      if (ref.current) obs.observe(ref.current);
      return obs;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []); // eslint-disable-line

  const scrollToSection = useCallback((i) => {
    sectionRefs[i].current?.scrollIntoView({ behavior: "smooth" });
  }, []); // eslint-disable-line

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Slow motion feel; frame rate is source-dependent and cannot force 120fps in HTML video.
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  /* ── Mouse for 3D ── */
  const mouse = useRef({ x: 0, y: 0 });
  const onMouseMove = useCallback((e) => {
    mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  /* ── Scroll-driven parallax ── */
  const { scrollY } = useScroll();

  // Hero text floats up faster than canvas → depth separation
  const heroTextY = useTransform(scrollY, [0, 900], [0, -90]);
  const heroTextOp = useTransform(scrollY, [0, 460], [1, 0]);
  const heroCanvasY = useTransform(scrollY, [0, 900], [0, -38]);
  const heroCanvasOp = useTransform(scrollY, [0, 700], [1, 0.15]);

  /* ─────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────── */
  return (
    <main style={{ background: "#ffffff" }}>
      {/* ── Dot Navigation ── */}
      <DotNav active={activeSection} onDotClick={scrollToSection} />

      {/* ══════════════════════════════════════════════════
          § 1 — HERO
      ══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        id="home"
        className="relative h-screen overflow-hidden snap-start"
        onMouseMove={onMouseMove}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, #f5f3ff 0%, #ffffff 65%)",
          }}
        />

        {/* Grain */}
        <div
          aria-hidden
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Video background — replace 3D scene */}
        <motion.div
          style={{ y: heroCanvasY, opacity: heroCanvasOp }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            loop
            className="absolute inset-0 h-full w-full object-cover"
            // TODO: Add video URL from CDN
            // src={heroVideo}
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(255, 255, 255, 0.25)" }}
          />
        </motion.div>

        {/* Left vignette */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 z-10 pointer-events-none"
          style={{
            width: "65%",
            background:
              "linear-gradient(to right,rgba(255,255,255,0.95) 0%,rgba(255,255,255,0.7) 52%,transparent 100%)",
          }}
        />

        {/* Vertical accent line */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-9 top-[22%] bottom-[22%] w-px z-20 pointer-events-none origin-top"
          style={{
            background: `linear-gradient(to bottom,transparent,${BRAND}55,transparent)`,
          }}
        />

        {/* Hero text — parallax faster than canvas */}
        <motion.div
          style={{ y: heroTextY, opacity: heroTextOp }}
          className="absolute inset-0 z-20 flex items-center"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-14 w-full pt-20">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.13, delayChildren: 0.2 },
                },
              }}
              className="max-w-[580px]"
            >
              {/* Eyebrow */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: T },
                }}
                className="flex items-center gap-3 mb-9"
              >
                <span
                  className="w-7 h-px shrink-0"
                  style={{ background: BRAND }}
                />
                <span
                  className="text-[11px] font-bold tracking-[0.28em] uppercase"
                  style={{ color: BRAND }}
                >
                  Real Estate · Storage · Infrastructure
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="font-bold leading-[1.04] tracking-tight mb-7 text-gray-900"
                style={{ fontSize: "clamp(2.8rem, 6.5vw, 5.4rem)" }}
              >
                Investing in the
                <br />
                <span style={{ color: BRAND }}>Spaces</span> That Matter.
              </motion.h1>

              {/* Sub-copy */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: T },
                }}
                className="text-lg md:text-xl leading-relaxed max-w-sm mb-12"
                style={{ color: "rgba(0,0,0,0.6)" }}
              >
                Since 1958, Greens Global has developed world-class real estate
                assets — from Class-A storage facilities to life sciences
                campuses across three continents.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: T },
                }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => scrollToSection(2)}
                  className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-wide rounded-sm transition-opacity hover:opacity-80"
                  style={{ background: BRAND, color: "#ffffff" }}
                >
                  View Portfolio
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    →
                  </motion.span>
                </button>
                <button
                  onClick={() => scrollToSection(4)}
                  className="inline-flex items-center px-8 py-4 text-sm font-medium tracking-wide rounded-sm transition-all duration-200 text-gray-700 hover:text-gray-900"
                  style={{ border: `1px solid ${BRAND}35` }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = BRAND)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = `${BRAND}35`)
                  }
                >
                  Our Story
                </button>
              </motion.div>

              {/* Trust strip */}
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { delay: 0.6, duration: 0.6 },
                  },
                }}
                className="flex flex-wrap items-center gap-6 mt-10 pt-8"
                style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
              >
                {["Greens Storage", "CubeSmart Partner", "Genopolis"].map(
                  (n) => (
                    <div key={n} className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: BRAND }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: "rgba(0,0,0,0.35)" }}
                      >
                        {n}
                      </span>
                    </div>
                  )
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => scrollToSection(1)}
        >
          <span
            className="text-[10px] tracking-[0.28em] uppercase"
            style={{ color: "rgba(0,0,0,0.3)" }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-9"
            style={{
              background: `linear-gradient(to bottom,${BRAND}55,transparent)`,
            }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 2 — OVERVIEW / STATS
      ══════════════════════════════════════════════════ */}
      <section
        ref={overviewRef}
        id="overview"
        className="relative h-screen snap-start flex flex-col items-center justify-center overflow-hidden px-6 lg:px-14"
        style={{ background: "#ffffff" }}
      >
        {/* Ambient glow - green gradient */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${BRAND}08 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 max-w-5xl w-full mx-auto">
          {/* Top label */}
          <motion.div
            {...inViewFadeUp}
            transition={T}
            className="text-center mb-16"
          >
            <Eyebrow>Company Overview</Eyebrow>
            <h2
              className="font-bold text-gray-900 leading-tight mb-5"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Building Value.
              <span style={{ color: BRAND }}> Across Borders.</span>
            </h2>
            <p
              className="max-w-xl mx-auto text-lg leading-relaxed"
              style={{ color: "rgba(0,0,0,0.65)" }}
            >
              Greens Global is a privately held investment and development firm
              with a decades-long track record spanning self-storage, retail,
              healthcare, and hospitality.
            </p>
          </motion.div>

          {/* Stat grid */}
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                {...staggerItem}
                className="rounded-sm p-8 text-center"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(0,0,0,0.15)",
                }}
              >
                <p
                  className="font-black mb-2"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    color: BRAND,
                    lineHeight: 1,
                  }}
                >
                  <Counter
                    to={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    grouping={s.grouping ?? true}
                  />
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: "rgba(0,0,0,0.65)" }}
                >
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom divider text */}
          <motion.p
            {...inViewFadeUp}
            transition={{ ...T, delay: 0.4 }}
            className="text-center mt-14 text-sm tracking-[0.15em] uppercase font-semibold"
            style={{ color: "rgba(0,0,0,0.78)" }}
          >
            Established 1958 · Global Real Estate Investment & Development
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 3 — PORTFOLIO
      ══════════════════════════════════════════════════ */}
      <section
        ref={portfolioRef}
        id="portfolio"
        className="relative h-screen snap-start flex flex-col justify-center overflow-hidden px-6 lg:px-14"
        style={{ background: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <motion.div {...inViewFadeUp} transition={T} className="mb-10">
            <Eyebrow>Portfolio</Eyebrow>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2
                className="font-bold text-gray-900 leading-tight"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)" }}
              >
                Featured Properties
              </h2>
              <button
                onClick={() => {}}
                className="text-sm font-semibold transition-colors duration-200 hover:opacity-80 flex items-center gap-2"
                style={{ color: BRAND }}
              >
                View all 7 projects →
              </button>
            </div>
          </motion.div>

          {/* Cards */}
          <motion.div
            {...staggerContainer}
            className="grid md:grid-cols-3 gap-5"
          >
            {FEATURED.map((p) => (
              <motion.div
                key={p.name + p.location}
                {...staggerItem}
                whileHover={CARD_HOVER}
                whileTap={CARD_TAP}
                className="rounded-sm p-7 flex flex-col gap-4 cursor-pointer group"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${BRAND}40`;
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.boxShadow =
                    "0 10px 24px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold tracking-[0.22em] uppercase px-2.5 py-1 rounded-sm"
                    style={{ background: `${BRAND}18`, color: BRAND }}
                  >
                    {p.tag}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: "rgba(0,0,0,0.45)" }}
                  >
                    {p.detail}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{p.name}</h3>
                  <p className="text-sm mt-0.5" style={{ color: BRAND }}>
                    {p.location}
                  </p>
                </div>
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "rgba(0,0,0,0.65)" }}
                >
                  {p.desc}
                </p>
                <div
                  className="flex items-center justify-end pt-3"
                  style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
                >
                  <span
                    className="text-xs font-bold transition-colors"
                    style={{ color: BRAND }}
                  >
                    Learn more →
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 4 — SERVICES
      ══════════════════════════════════════════════════ */}
      <section
        ref={servicesRef}
        id="services"
        className="relative h-screen snap-start flex flex-col justify-center overflow-hidden px-6 lg:px-14"
        style={{ background: "#ffffff" }}
      >
        {/* Top glow */}
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom,${BRAND}40,transparent)`,
          }}
        />

        <div className="max-w-7xl mx-auto w-full">
          <motion.div {...inViewFadeUp} transition={T} className="mb-12">
            <Eyebrow>What We Do</Eyebrow>
            <h2
              className="font-bold text-gray-900 leading-tight"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)" }}
            >
              Four Pillars of{" "}
              <span style={{ color: BRAND }}>Investment Excellence</span>
            </h2>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {SERVICES.map((s) => (
              <motion.div
                key={s.title}
                {...staggerItem}
                whileHover={CARD_HOVER}
                whileTap={CARD_TAP}
                className="p-7 rounded-sm flex flex-col gap-5"
                style={{
                  background: "rgba(255,255,255,0.022)",
                  border: "1px solid rgba(0,0,0,0.15)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = `${BRAND}35`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)")
                }
              >
                <span
                  className="font-black text-3xl tabular-nums"
                  style={{ color: BRAND, fontVariantNumeric: "tabular-nums" }}
                >
                  {s.n}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 leading-snug">
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(0,0,0,0.65)" }}
                  >
                    {s.desc}
                  </p>
                </div>
                <span
                  className="w-8 h-px mt-auto"
                  style={{ background: BRAND }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 5 — ABOUT
      ══════════════════════════════════════════════════ */}
      <section
        ref={aboutRef}
        id="about"
        className="relative h-screen snap-start flex flex-col justify-center overflow-hidden px-6 lg:px-14"
        style={{ background: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — story */}
          <motion.div {...inViewFadeLeft} transition={T}>
            <Eyebrow>About Us</Eyebrow>
            <h2
              className="font-bold text-gray-900 leading-tight mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}
            >
              Over Six Decades of
              <br />
              <span style={{ color: BRAND }}>Building Value.</span>
            </h2>
            <p
              className="mb-4 leading-relaxed"
              style={{ color: "rgba(0,0,0,0.68)", lineHeight: 1.8 }}
            >
              Founded in 1958 and headquartered in San Clemente, California,
              Greens Global is a privately held real estate investment and
              development firm spanning self-storage, retail, healthcare, and
              hospitality.
            </p>
            <p
              className="mb-10 leading-relaxed"
              style={{ color: "rgba(0,0,0,0.6)", lineHeight: 1.8 }}
            >
              Our integrated model combines institutional capital discipline
              with hands-on operational excellence — from site selection through
              long-term asset management.
            </p>

            {/* Timeline strip */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { year: "1958", event: "Company Founded" },
                { year: "1990s", event: "Storage Expansion" },
                { year: "2010s", event: "REIT Partnerships" },
                { year: "2023", event: "Escondido Opens" },
              ].map((item, i) => (
                <motion.div
                  key={item.year}
                  className="p-4 rounded-sm"
                  whileHover={CARD_HOVER}
                  whileTap={CARD_TAP}
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.12)",
                  }}
                >
                  <p
                    className="font-black text-sm mb-0.5"
                    style={{ color: BRAND }}
                  >
                    {item.year}
                  </p>
                  <p className="text-xs" style={{ color: "rgba(0,0,0,0.55)" }}>
                    {item.event}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — stats */}
          <motion.div {...inViewFadeRight} transition={{ ...T, delay: 0.15 }}>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {STATS.map((s) => (
                <motion.div
                  key={s.label}
                  className="p-7 rounded-sm text-center"
                  whileHover={CARD_HOVER}
                  whileTap={CARD_TAP}
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.12)",
                  }}
                >
                  <p
                    className="font-black mb-1"
                    style={{
                      fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                      color: BRAND,
                      lineHeight: 1,
                    }}
                  >
                    <Counter
                      to={s.value}
                      prefix={s.prefix}
                      suffix={s.suffix}
                      grouping={s.grouping ?? true}
                    />
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "rgba(0,0,0,0.55)" }}
                  >
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="p-7 rounded-sm"
              whileHover={CARD_HOVER}
              whileTap={CARD_TAP}
              style={{
                background: "#ffffff",
                border: `1px solid ${BRAND}25`,
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(0,0,0,0.6)" }}
              >
                <span className="font-bold text-gray-900">
                  Investor & Partner Relations
                </span>
                <br />
                Reach out to discuss opportunities
                <br />
                <span style={{ color: BRAND }}>+1 (949) 546-0560</span>
              </p>
            </motion.div>

            <button
              onClick={() => scrollToSection(5)}
              className="mt-6 inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-wide rounded-sm transition-opacity hover:opacity-80"
              style={{ background: BRAND, color: "#ffffff" }}
            >
              Work With Us →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          § 6 — CONTACT / CTA  +  FOOTER
      ══════════════════════════════════════════════════ */}
      <section
        ref={contactRef}
        id="contact"
        className="relative h-screen snap-start flex flex-col overflow-hidden"
        style={{ background: "#ffffff" }}
      >
        {/* Glow blob */}
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle,${BRAND}12 0%,transparent 65%)`,
          }}
        />

        {/* CTA content — vertically centered in the section minus footer height */}
        <div className="flex-1 flex items-center justify-center px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div {...inViewFadeUp} transition={T}>
              <Eyebrow>
                <span className="mx-auto">Start a Conversation</span>
              </Eyebrow>
            </motion.div>
            <motion.h2
              {...inViewFadeUp}
              transition={{ ...T, delay: 0.1 }}
              className="font-bold text-gray-900 leading-tight mb-6"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              Ready to Explore
              <br />
              <span style={{ color: BRAND }}>Opportunities?</span>
            </motion.h2>
            <motion.p
              {...inViewFadeUp}
              transition={{ ...T, delay: 0.2 }}
              className="text-lg mb-10 leading-relaxed"
              style={{ color: "rgba(0,0,0,0.65)" }}
            >
              Whether you're an investor, operator, or development partner —
              we'd love to connect and explore how Greens Global can create
              lasting value together.
            </motion.p>
            <motion.div
              {...inViewFadeUp}
              transition={{ ...T, delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <a
                href="mailto:info@greensglobal.com"
                className="px-10 py-4 text-sm font-bold tracking-wide rounded-sm transition-opacity hover:opacity-80"
                style={{ background: BRAND, color: "#ffffff" }}
              >
                Contact Us
              </a>
              <a
                href="tel:+19495460560"
                className="px-10 py-4 text-sm font-medium tracking-wide rounded-sm transition-all duration-200 text-gray-700 hover:text-gray-900"
                style={{ border: `1px solid ${BRAND}40` }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = BRAND)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = `${BRAND}40`)
                }
              >
                +1 (949) 546-0560
              </a>
            </motion.div>
            <motion.div
              {...inViewFadeUp}
              transition={{ ...T, delay: 0.45 }}
              className="mt-10 mx-auto relative overflow-hidden rounded-sm px-5 py-3 border"
              style={{
                borderColor: "rgba(156,199,43,0.35)",
                background: "#ffffff",
              }}
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(100deg, rgba(156,199,43,0) 10%, rgba(156,199,43,0.22) 50%, rgba(156,199,43,0) 90%)",
                }}
                animate={{ x: ["-130%", "130%"] }}
                transition={{ duration: 3.1, ease: "linear", repeat: Infinity }}
              />
              <span
                className="relative text-xs tracking-[0.16em] uppercase font-semibold"
                style={{ color: "rgba(0,0,0,0.78)" }}
              >
                910 S. El Camino Real, Suite #202 · San Clemente, CA 92672
              </span>
            </motion.div>
          </div>
        </div>

        {/* Footer — pinned to bottom of this section */}
        <footer
          className="relative z-10 shrink-0 py-7"
          style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.75 }}
            variants={FOOTER_STAGGER}
            className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <motion.div
              variants={FOOTER_ITEM}
              whileHover={{ y: -2 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-7 h-7 rounded-sm flex items-center justify-center"
                style={{ background: BRAND }}
              >
                <span className="text-[#ffffff] font-black text-xs">GG</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-none">
                  Greens Global
                </p>
                <p
                  className="text-[10px] tracking-widest leading-none mt-0.5"
                  style={{ color: `${BRAND}88` }}
                >
                  EST. 1958
                </p>
              </div>
            </motion.div>
            <motion.p
              variants={FOOTER_ITEM}
              className="text-xs"
              style={{ color: "rgba(0,0,0,0.3)" }}
            >
              © {new Date().getFullYear()} Greens Global, Inc. All Rights
              Reserved.
            </motion.p>
            <motion.div variants={FOOTER_ITEM} className="flex gap-5">
              {["Privacy Policy", "Employee Portal", "Careers"].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-xs hover:text-gray-900 transition-colors"
                  style={{ color: "rgba(0,0,0,0.55)" }}
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </footer>
      </section>
    </main>
  );
}
