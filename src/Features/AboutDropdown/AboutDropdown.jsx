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
      className="absolute left-0 top-full mt-2 w-[min(380px,calc(100vw-2rem))] p-4 rounded-lg border border-gray-200 bg-white/98 backdrop-blur-xl shadow-[0_0_35px_rgba(217,119,6,0.15)] z-40"
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <div>
        <p className="text-xs font-bold tracking-widest text-[#d97706] mb-2">
          GREENS GLOBAL
        </p>
        {items.map((sub) => (
          <a
            key={sub.label}
            href={sub.href}
            className="block text-sm text-gray-700 hover:text-[#d97706] py-1 px-2 rounded-sm transition-colors duration-200"
          >
            {sub.label}
          </a>
        ))}
      </div>

      <div className="mt-2 h-px bg-gradient-to-r from-transparent via-[#d97706]/40 to-transparent" />
      <a
        href="#careers"
        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#d97706] hover:text-gray-900 transition-colors"
      >
        Explore Careers →
      </a>
    </motion.div>
  );
};

export default AboutDropdown;
