import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AboutDropdown from "../AboutDropdown/AboutDropdown";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Services", href: "#services" },
  {
    label: "About",
    href: "#about",
    children: [
      { label: "About Us", href: "#about" },
      { label: "Our Team", href: "#team" },
      { label: "Our History", href: "#history" },
      { label: "Contact Us", href: "#contact" },
    ],
  },
  { label: "Investors", href: "#contact" },
];

const linkVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060f07]/90 border-b border-[#9cc72b]/30 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.35)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 lg:px-12 h-[72px] flex items-center justify-between">
        <a
          href="#home"
          className="inline-flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:shadow-[0_0_28px_rgba(156,199,43,0.5)]"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#8dea25] to-[#74c000] text-xs font-black text-[#050a05]">
            GG
          </span>
          <span className="text-sm font-semibold tracking-wide text-white">
            Greens Global
          </span>
        </a>

        <motion.ul
          className="hidden md:flex items-center gap-1"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {LINKS.map(({ label, href, children }) => (
            <motion.li
              key={label}
              className="relative"
              onMouseEnter={() => children && setAboutOpen(true)}
              onMouseLeave={() => children && setAboutOpen(false)}
              variants={linkVariants}
            >
              <motion.a
                href={href}
                className="inline-flex items-center px-4 py-2 text-sm font-medium tracking-wide text-white/70 transition-all duration-250 hover:text-[#9cc72b] hover:tracking-wider"
                whileHover={{ scale: 1.02 }}
              >
                {label}
              </motion.a>

              {children && aboutOpen && (
                <AnimatePresence>
                  <AboutDropdown items={children} open={aboutOpen} />
                </AnimatePresence>
              )}
            </motion.li>
          ))}

          <motion.li variants={linkVariants}>
            <a
              href="#contact"
              className="rounded-md bg-gradient-to-r from-[#9cc72b]/95 to-[#7fd646] px-5 py-2 text-sm font-bold text-[#050a05] shadow-[0_0_18px_rgba(156,199,43,0.72)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105"
            >
              Get in Touch
            </a>
          </motion.li>
        </motion.ul>

        <button
          className="md:hidden p-2 flex flex-col gap-1.5"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                i === 0 && menuOpen ? "rotate-45 translate-y-2" : ""
              } ${i === 1 && menuOpen ? "opacity-0" : ""} ${
                i === 2 && menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-[#050a05]/95 backdrop-blur-md border-t border-[#9cc72b]/20"
          >
            <ul className="px-6 py-4 flex flex-col gap-1">
              {LINKS.map(({ label, href, children }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 text-white/70 hover:text-white font-medium border-b border-[#ffffff1c] transition-colors"
                  >
                    {label}
                  </a>

                  {children && (
                    <div className="pl-4 pb-2">
                      {children.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMenuOpen(false)}
                          className="block py-2 text-sm text-white/60 hover:text-white transition-colors"
                        >
                          {sub.label}
                        </a>
                      ))}
                      <div className="mt-1 h-px bg-gradient-to-r from-transparent via-[#9cc72b]/60 to-transparent" />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
