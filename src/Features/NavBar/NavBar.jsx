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

export default function NavBar({
  onOpenPortfolio,
  onGoHome,
  isPortfolioPage = false,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const navLight = isPortfolioPage || scrolled;

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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <nav
        className={`w-full h-16 transition-all duration-300 border-b ${
          navLight
            ? "bg-white/88 border-slate-200/70 backdrop-blur-xl shadow-[0_6px_20px_rgba(2,6,23,0.07)]"
            : "bg-black/8 border-transparent backdrop-blur-sm"
        }`}
      >
        <div className="max-w-6xl mx-auto h-full w-full px-6 flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              if (isPortfolioPage) {
                e.preventDefault();
                onGoHome?.();
              }
            }}
            className="inline-flex items-center gap-3 px-1.5 py-1.5 transition-all duration-300"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#9cc72b] to-[#7fd646] text-xs font-black text-white">
              GG
            </span>
            <span
              className={`text-sm font-semibold tracking-[0.01em] ${
                navLight ? "text-slate-900" : "text-white"
              }`}
            >
              Greens Global
            </span>
          </a>

          <motion.ul
            className="hidden md:flex items-center gap-0.5 shrink-0"
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
                {label === "Portfolio" ? (
                  <motion.a
                    href="#portfolio"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenPortfolio?.();
                    }}
                    className={`inline-flex items-center px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                      navLight
                        ? "text-slate-700 hover:text-[#9cc72b]"
                        : "text-white/82 hover:text-[#9cc72b]"
                    }`}
                  >
                    {label}
                  </motion.a>
                ) : label === "Home" && isPortfolioPage ? (
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      onGoHome?.();
                    }}
                    className={`inline-flex items-center px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                      navLight
                        ? "text-slate-700 hover:text-[#9cc72b]"
                        : "text-white/82 hover:text-[#9cc72b]"
                    }`}
                  >
                    {label}
                  </motion.button>
                ) : (
                  <motion.a
                    href={href}
                    className={`inline-flex items-center px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                      navLight
                        ? "text-slate-700 hover:text-[#9cc72b]"
                        : "text-white/82 hover:text-[#9cc72b]"
                    }`}
                  >
                    {label}
                  </motion.a>
                )}

                {children && aboutOpen && (
                  <AnimatePresence>
                    <AboutDropdown
                      items={children}
                      open={aboutOpen}
                      scrolled={scrolled}
                    />
                  </AnimatePresence>
                )}
              </motion.li>
            ))}

            <motion.li variants={linkVariants}>
              <a
                href="#contact"
                className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-[#9cc72b] px-4 py-2 text-[12px] font-semibold text-white transition-all duration-200 hover:opacity-95 hover:shadow-[0_0_24px_rgba(156,199,43,0.42)] lg:px-5"
              >
                Get in Touch
              </a>
            </motion.li>
          </motion.ul>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-0.5 w-6 transition-all duration-300 ${
                  navLight ? "bg-slate-900" : "bg-white"
                } ${
                  i === 0 && menuOpen ? "rotate-45 translate-y-2" : ""
                } ${i === 1 && menuOpen ? "opacity-0" : ""} ${
                  i === 2 && menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            ))}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl"
          >
            <ul className="px-6 py-4 flex flex-col gap-1">
              {LINKS.map(({ label, href, children }) => (
                <li key={label}>
                  {label === "Portfolio" ? (
                    <a
                      href="#portfolio"
                      onClick={(e) => {
                        e.preventDefault();
                        setMenuOpen(false);
                        onOpenPortfolio?.();
                      }}
                      className="block w-full text-left border-b border-slate-200 py-3 font-medium text-slate-700 transition-colors hover:text-[#9cc72b]"
                    >
                      {label}
                    </a>
                  ) : label === "Home" && isPortfolioPage ? (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onGoHome?.();
                      }}
                      className="block w-full text-left border-b border-slate-200 py-3 font-medium text-slate-700 transition-colors hover:text-[#9cc72b]"
                    >
                      {label}
                    </button>
                  ) : (
                    <a
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-slate-200 py-3 font-medium text-slate-700 transition-colors hover:text-[#9cc72b]"
                    >
                      {label}
                    </a>
                  )}

                  {children && (
                    <div className="pl-4 pb-2">
                      {children.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMenuOpen(false)}
                          className="block py-2 text-sm text-slate-600 transition-colors hover:text-[#9cc72b]"
                        >
                          {sub.label}
                        </a>
                      ))}
                      <div className="mt-1 h-px bg-gradient-to-r from-transparent via-[#9cc72b]/40 to-transparent" />
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
