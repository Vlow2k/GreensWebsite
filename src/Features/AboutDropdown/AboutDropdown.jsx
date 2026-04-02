import { motion } from "framer-motion";

const AboutDropdown = ({ items, open }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.95 }}
      animate={
        open
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: -6, scale: 0.95 }
      }
      exit={{ opacity: 0, y: -8, scale: 0.94 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-0 top-full mt-2 w-[min(380px,calc(100vw-2rem))] p-4 rounded-lg border border-white/[0.10] bg-[#050a05]/96 backdrop-blur-xl shadow-[0_0_35px_rgba(156,199,43,0.2)] z-40"
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <div>
        <p className="text-xs font-bold tracking-widest text-[#9cc72b] mb-2">
          GREENS GLOBAL
        </p>
        {items.map((sub) => (
          <a
            key={sub.label}
            href={sub.href}
            className="block text-sm text-white/80 hover:text-white py-1 px-2 rounded-sm transition-colors duration-200"
          >
            {sub.label}
          </a>
        ))}
      </div>

      <div className="mt-2 h-px bg-gradient-to-r from-transparent via-[#9cc72b]/80 to-transparent" />
      <a
        href="#careers"
        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#9cc72b] hover:text-white transition-colors"
      >
        Explore Careers →
      </a>
    </motion.div>
  );
};

export default AboutDropdown;
