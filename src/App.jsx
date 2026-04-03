import { useEffect, useState, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import NavBar from "./Features/NavBar/NavBar";
import LandingPage from "./Features/LandingPage/LandingPage";

const PortfolioPage = lazy(
  () => import("./Features/PortfolioPage/PortfolioPage")
);
const OurTeamPage = lazy(() => import("./Features/OurTeamPage/OurTeamPage"));
const AboutUs = lazy(() => import("./Features/AboutUs/AboutUs"));

export default function App() {
  const [activePage, setActivePage] = useState("home");

  const openPortfolio = () => {
    setActivePage("portfolio");
    if (window.location.hash !== "#portfolio") {
      window.history.replaceState(null, "", "#portfolio");
    }
  };

  const openTeam = () => {
    setActivePage("team");
    if (window.location.hash !== "#team") {
      window.history.replaceState(null, "", "#team");
    }
  };

  const openAbout = () => {
    setActivePage("about");
    if (window.location.hash !== "#about") {
      window.history.replaceState(null, "", "#about");
    }
  };

  const goHome = () => {
    setActivePage("home");
    if (window.location.hash !== "#home") {
      window.history.replaceState(null, "", "#home");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#portfolio") {
        setActivePage("portfolio");
      } else if (hash === "#team") {
        setActivePage("team");
      } else if (hash === "#about") {
        setActivePage("about");
      } else {
        setActivePage("home");
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
        onOpenTeam={openTeam}
        onOpenAbout={openAbout}
        onGoHome={goHome}
        isPortfolioPage={activePage === "portfolio"}
        isTeamPage={activePage === "team"}
        isAboutPage={activePage === "about"}
      />

      <AnimatePresence mode="wait">
        {activePage === "portfolio" ? (
          <Suspense fallback={null}>
            <PortfolioPage />
          </Suspense>
        ) : activePage === "team" ? (
          <Suspense fallback={null}>
            <OurTeamPage />
          </Suspense>
        ) : activePage === "about" ? (
          <Suspense fallback={null}>
            <AboutUs />
          </Suspense>
        ) : (
          <LandingPage onOpenPortfolio={openPortfolio} />
        )}
      </AnimatePresence>
    </>
  );
}
