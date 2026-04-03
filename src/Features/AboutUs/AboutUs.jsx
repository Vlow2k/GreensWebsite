import { useState, useRef, useEffect, Suspense } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const BRAND = "#9cc72b";

const STORY_SECTIONS = [
  {
    id: 0,
    phase: "Our Story",
    title: "From Vision to Global Platform",
    description:
      "More than 65 years of excellence, innovation, and unwavering commitment to creating exceptional value.",
    type: "hero",
  },
  {
    id: 1,
    phase: "The Vision",
    year: "1958",
    title: "A Foundation Built on Values",
    description:
      "What began as a visionary idea has grown into a legacy. Greens Global was founded with a simple yet powerful mission: to create exceptional properties that serve communities and generate sustainable returns.",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2020/06/Rajesh-Kadakia-e1592165351391.jpg",
    person: "Rajesh J. Kadakia",
    role: "Founding Principal",
    alignment: "left",
  },
  {
    id: 2,
    phase: "Growth Through Leadership",
    year: "1980s - 2000s",
    title: "Building Excellence",
    description:
      "Through decades of dedication, the Kadakia family transformed a single vision into a diversified platform of premium properties. Strategic acquisitions and operational excellence became the hallmark of Greens Global.",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2020/06/Neil-Kadakia-e1592165304725.jpg",
    person: "Neil R. Kadakia",
    role: "Managing Principal",
    alignment: "right",
  },
  {
    id: 3,
    phase: "Expansion & Innovation",
    year: "2010s",
    title: "Diversifying Across Markets",
    description:
      "Greens Global expanded into storage facilities, commercial real estate, and corporate development. Each asset was chosen strategically to complement our core competencies and maximize stakeholder value.",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2020/06/Darshana-Kadakia.jpg",
    person: "Darshana Kadakia, M.D.",
    role: "Principal",
    alignment: "left",
  },
  {
    id: 4,
    phase: "Today & Tomorrow",
    year: "2020+",
    title: "A Global Platform",
    description:
      "Today, Greens Global operates a world-class portfolio with a team of exceptional professionals. We remain committed to growth, innovation, and creating lasting value for our partners, investors, and communities.",
    stats: [
      { label: "Years of Excellence", value: "65+" },
      { label: "Properties", value: "15+" },
      { label: "Team Members", value: "25+" },
      { label: "States", value: "Multiple" },
    ],
    type: "stats",
  },
  {
    id: 5,
    phase: "Join Us",
    title: "Ready to Be Part of Our Story?",
    description:
      "Join us as we continue to build exceptional properties and opportunities for investors, partners, and communities worldwide.",
    type: "cta",
  },
];

// 3D Rotating Cube Component
function RotatingCube() {
  const meshRef = useRef(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const animate = () => {
      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.005;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <group ref={meshRef}>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial
          color={BRAND}
          emissive={BRAND}
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh scale={2.1}>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial
          color={BRAND}
          emissive={BRAND}
          emissiveIntensity={0.1}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}

// 3D Particle System
function ParticleSystem() {
  const particlesRef = useRef(null);

  useEffect(() => {
    if (!particlesRef.current) return;

    const particles = particlesRef.current;
    const positionArray = new Float32Array(300 * 3);

    for (let i = 0; i < 300 * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 8;
    }

    particles.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );

    let time = 0;
    const animate = () => {
      time += 0.001;
      const positionAttribute = particles.geometry.getAttribute("position");

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);

        positionAttribute.setXYZ(
          i,
          x + Math.sin(time + i) * 0.01,
          y + Math.cos(time + i) * 0.01,
          z + Math.sin(time + i * 0.5) * 0.01
        );
      }
      positionAttribute.needsUpdate = true;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial color={BRAND} size={0.08} sizeAttenuation />
    </points>
  );
}

export default function AboutUs() {
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef(null);

  // Detect which section is in view inside the snap container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(container.querySelectorAll("[data-section]"));
    const observer = new IntersectionObserver(
      (entries) => {
        let nextIndex = currentSection;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = sections.indexOf(entry.target);
          if (index === -1) return;

          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            nextIndex = index;
          }
        });

        if (maxRatio > 0) {
          setCurrentSection(nextIndex);
        }
      },
      {
        root: container,
        threshold: [0.35, 0.5, 0.7, 0.9],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={containerRef}
      className="relative min-h-[100svh] overflow-y-auto overflow-x-hidden scroll-smooth lg:h-screen lg:snap-y lg:snap-mandatory"
      style={{ background: "#f1f5ee" }}
    >
      {/* 3D Background - Fixed */}
      <div className="fixed inset-0 pointer-events-none -z-10 h-[100svh] w-screen">
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 4], fov: 75 }}
            style={{ opacity: 0.4 }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 4]} />
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 5, 5]} intensity={0.8} />
            <RotatingCube />
            <ParticleSystem />
            <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
          </Canvas>
        </Suspense>
      </div>

      {/* Vertical Scroll Sections */}
      {STORY_SECTIONS.map((section, index) => (
        <motion.div
          key={section.id}
          data-section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
          className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden px-4 py-20 sm:px-5 md:px-8 md:py-24 lg:snap-start lg:snap-always"
          style={{
            background:
              section.type === "cta"
                ? "linear-gradient(135deg, #9cc72b 0%, #7aa61f 100%)"
                : index % 2 === 0
                  ? "#f1f5ee"
                  : "#ffffff",
          }}
        >
          <>
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  section.type === "cta"
                    ? "radial-gradient(ellipse 62% 50% at 50% 52%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0) 78%)"
                    : "radial-gradient(ellipse 62% 50% at 50% 52%, rgba(156,199,43,0.26) 0%, rgba(156,199,43,0.14) 42%, rgba(156,199,43,0) 78%)",
              }}
              animate={{ opacity: [0.86, 1, 0.86] }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full"
              style={{
                background:
                  section.type === "cta"
                    ? "radial-gradient(circle, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 72%)"
                    : "radial-gradient(circle, rgba(156,199,43,0.28) 0%, rgba(156,199,43,0) 72%)",
                filter: "blur(12px)",
              }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 bottom-16 h-72 w-72 rounded-full"
              style={{
                background:
                  section.type === "cta"
                    ? "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 72%)"
                    : "radial-gradient(circle, rgba(156,199,43,0.24) 0%, rgba(156,199,43,0) 72%)",
                filter: "blur(14px)",
              }}
              animate={{ scale: [1, 1.07, 1], opacity: [0.78, 1, 0.78] }}
              transition={{
                duration: 5.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </>

          {section.type === "hero" && (
            <div className="mx-auto max-w-screen-xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: false, amount: 0.5 }}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.28em]"
                  style={{ color: BRAND }}
                >
                  {section.phase}
                </span>
                <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-7xl">
                  From Vision to
                  <br />
                  <span style={{ color: BRAND }}>Global Platform</span>
                </h1>
                <p
                  className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed lg:text-xl"
                  style={{ color: "rgba(15,23,42,0.68)" }}
                >
                  {section.description}
                </p>

                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mx-auto mt-12 flex justify-center"
                >
                  <div
                    style={{ color: BRAND }}
                    className="flex flex-col items-center gap-3"
                  >
                    <span className="text-xs font-bold uppercase tracking-[0.16em]">
                      Scroll to explore
                    </span>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}

          {section.type === "stats" && (
            <div className="mx-auto max-w-screen-xl w-full">
              <div className="mb-12 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: false, amount: 0.5 }}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.28em]"
                    style={{ color: BRAND }}
                  >
                    {section.phase}
                  </span>
                  <h2 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-slate-900 lg:text-5xl">
                    {section.title}
                  </h2>
                  <p
                    className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed"
                    style={{ color: "rgba(15,23,42,0.68)" }}
                  >
                    {section.description}
                  </p>
                </motion.div>
              </div>

              {section.stats && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: false, amount: 0.5 }}
                  className="grid grid-cols-2 gap-6 md:grid-cols-4"
                >
                  {section.stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: false, amount: 0.5 }}
                      className="rounded-2xl px-6 py-8 text-center"
                      style={{
                        background: "#f1f5ee",
                        border: `1px solid rgba(156,199,43,0.18)`,
                      }}
                    >
                      <p
                        className="text-4xl font-black leading-none text-slate-900 lg:text-5xl"
                        style={{ color: BRAND }}
                      >
                        {stat.value}
                      </p>
                      <p
                        className="mt-2 text-xs font-bold uppercase tracking-[0.16em]"
                        style={{ color: "rgba(15,23,42,0.56)" }}
                      >
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {section.type === "cta" && (
            <div className="mx-auto max-w-screen-xl text-center w-full relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: false, amount: 0.5 }}
              >
                <h2 className="text-4xl font-black leading-tight text-white lg:text-5xl">
                  {section.title}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white text-opacity-90">
                  {section.description}
                </p>
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold text-slate-900 transition-all"
                  style={{ background: "#ffffff" }}
                >
                  Get In Touch
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </motion.a>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
            </div>
          )}

          {!section.type && (
            <div className="mx-auto max-w-screen-xl w-full">
              <div
                className={`grid items-center gap-8 lg:grid-cols-2 ${
                  section.alignment === "right" ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text */}
                <motion.div
                  initial={{
                    opacity: 0,
                    x: section.alignment === "left" ? -40 : 40,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: false, amount: 0.5 }}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.28em]"
                    style={{ color: BRAND }}
                  >
                    {section.phase} · {section.year}
                  </span>
                  <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 lg:text-4xl">
                    {section.title}
                  </h2>
                  <p
                    className="mt-4 text-base leading-relaxed lg:text-lg"
                    style={{ color: "rgba(15,23,42,0.68)" }}
                  >
                    {section.description}
                  </p>
                  {section.person && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2,
                      }}
                      viewport={{
                        once: false,
                        amount: 0.5,
                      }}
                      className="mt-6 flex items-center gap-4"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {section.person}
                        </p>
                        <p
                          className="text-xs font-bold uppercase tracking-[0.16em]"
                          style={{ color: BRAND }}
                        >
                          {section.role}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Image */}
                {section.image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 24 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    whileHover={{ y: -8, scale: 1.015 }}
                    transition={{ duration: 0.65 }}
                    viewport={{ once: false, amount: 0.5 }}
                    className="relative mx-auto w-full max-w-[290px] overflow-hidden rounded-3xl sm:max-w-[340px] lg:max-w-[390px]"
                    style={{
                      background:
                        "linear-gradient(180deg, #edf2f7 0%, #dbe4ef 100%)",
                      aspectRatio: "4 / 5",
                      boxShadow: "0 24px 70px rgba(15, 23, 42, 0.18)",
                    }}
                  >
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full"
                      animate={{
                        scale: [1, 1.16, 1],
                        opacity: [0.2, 0.35, 0.2],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        background:
                          "radial-gradient(circle, rgba(156,199,43,0.5) 0%, rgba(156,199,43,0) 70%)",
                      }}
                    />
                    <motion.img
                      src={section.image}
                      alt={section.person}
                      className="h-full w-full object-cover object-center p-3 sm:p-4"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
                      animate={{ x: ["-120%", "320%"] }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        repeatDelay: 1.8,
                        ease: "easeInOut",
                      }}
                      style={{
                        background:
                          "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.28) 45%, transparent 100%)",
                        transform: "skewX(-16deg)",
                      }}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      ))}

      {/* Navigation Dots */}
      <motion.div
        className="fixed bottom-8 left-1/2 z-40 flex gap-2"
        style={{ transform: "translateX(-50%)" }}
      >
        {STORY_SECTIONS.map((_, index) => (
          <motion.div
            key={index}
            className="h-2.5 rounded-full transition-all duration-300"
            style={{
              width: index === currentSection ? 32 : 8,
              background:
                index === currentSection ? BRAND : "rgba(156,199,43,0.4)",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
