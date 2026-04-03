import { motion } from "framer-motion";

const ITEM_META = {
  "About Us": "Our perspective and long-term investment philosophy.",
  "Our Team": "Leadership, operators, and development expertise.",
  "Our History": "Six decades of growth across asset classes.",
  "Contact Us": "Start a conversation with our team.",
};

const panelVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.24,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
};

const AboutDropdown = ({ items, open, scrolled = false, onNavigate }) => {
  return (
    <div
      className="absolute left-0 top-full pt-2 w-[min(520px,calc(100vw-2rem))] z-40"
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <motion.div
        initial="hidden"
        animate={open ? "show" : "hidden"}
        exit="exit"
        variants={panelVariants}
        className="overflow-hidden rounded-2xl border"
        style={{
          borderColor: scrolled
            ? "rgba(15,23,42,0.08)"
            : "rgba(255,255,255,0.14)",
          background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(7,12,22,0.9)",
          backdropFilter: "blur(18px)",
          boxShadow: scrolled
            ? "0 22px 50px rgba(15,23,42,0.12)"
            : "0 24px 60px rgba(0,0,0,0.28)",
        }}
      >
        <div className="relative p-5">
          <motion.div
            aria-hidden
            className="absolute right-0 top-0 h-28 w-28 rounded-full blur-3xl"
            style={{ background: "rgba(156,199,43,0.14)" }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            variants={itemVariants}
            className="relative mb-4 flex items-start justify-between gap-4"
          >
            <div>
              <p
                className="mb-1 text-[11px] font-bold tracking-[0.24em] uppercase"
                style={{ color: "#9cc72b" }}
              >
                Greens Global
              </p>
              <h3
                className="text-sm font-semibold"
                style={{
                  color: scrolled ? "#0f172a" : "rgba(255,255,255,0.92)",
                }}
              >
                Explore the firm
              </h3>
            </div>
            <div
              className="h-px flex-1 self-center"
              style={{
                background: scrolled
                  ? "linear-gradient(to right, rgba(15,23,42,0.1), transparent)"
                  : "linear-gradient(to right, rgba(255,255,255,0.18), transparent)",
              }}
            />
          </motion.div>

          <div className="relative grid gap-2 sm:grid-cols-2">
            {items.map((sub) => (
              <motion.a
                key={sub.label}
                href={sub.href}
                onClick={(e) => onNavigate?.(sub, e)}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className="group rounded-xl px-4 py-3 transition-colors duration-200"
                style={{
                  background: scrolled
                    ? "rgba(15,23,42,0.03)"
                    : "rgba(255,255,255,0.03)",
                  border: scrolled
                    ? "1px solid rgba(15,23,42,0.06)"
                    : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="text-sm font-semibold transition-colors duration-200"
                    style={{
                      color: scrolled ? "#0f172a" : "rgba(255,255,255,0.92)",
                    }}
                  >
                    {sub.label}
                  </span>
                  <span className="text-[#9cc72b] transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </div>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{
                    color: scrolled
                      ? "rgba(15,23,42,0.58)"
                      : "rgba(255,255,255,0.56)",
                  }}
                >
                  {ITEM_META[sub.label]}
                </p>
              </motion.a>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="relative mt-4 flex items-center justify-between rounded-xl px-4 py-3"
            style={{
              background: scrolled
                ? "rgba(156,199,43,0.08)"
                : "rgba(156,199,43,0.12)",
              border: "1px solid rgba(156,199,43,0.2)",
            }}
          >
            <div>
              <p
                className="text-[11px] font-bold tracking-[0.2em] uppercase"
                style={{ color: "#9cc72b" }}
              >
                Careers
              </p>
              <p
                className="mt-1 text-xs"
                style={{
                  color: scrolled
                    ? "rgba(15,23,42,0.62)"
                    : "rgba(255,255,255,0.64)",
                }}
              >
                See current roles and growth opportunities.
              </p>
            </div>
            <a
              href="#careers"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#9cc72b] transition-colors hover:text-[#84d93f]"
            >
              Explore
              <span>→</span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutDropdown;
