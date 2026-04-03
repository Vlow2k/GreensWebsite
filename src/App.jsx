import { useEffect, useState, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import NavBar from "./Features/NavBar/NavBar";
import LandingPage from "./Features/LandingPage/LandingPage";

const PortfolioPage = lazy(
  () => import("./Features/PortfolioPage/PortfolioPage")
);

export default function App() {
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const openPortfolio = () => {
    setPortfolioOpen(true);
    if (window.location.hash !== "#portfolio") {
      window.history.replaceState(null, "", "#portfolio");
    }
  };
  const closePortfolio = () => {
    setPortfolioOpen(false);
    if (window.location.hash !== "#home") {
      window.history.replaceState(null, "", "#home");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#portfolio") {
        setPortfolioOpen(true);
      } else if (hash === "#home" || hash === "") {
        setPortfolioOpen(false);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return (
    <>
      <NavBar
        onOpenPortfolio={openPortfolio}
        onGoHome={closePortfolio}
        isPortfolioPage={portfolioOpen}
      />

      <AnimatePresence mode="wait">
        {portfolioOpen ? (
          <Suspense fallback={null}>
            <PortfolioPage />
          </Suspense>
        ) : (
          <LandingPage onOpenPortfolio={openPortfolio} />
        )}
      </AnimatePresence>
    </>
  );
}
