import {
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Html, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import {
  AnimatePresence,
  motion,
  animate,
  useMotionValue,
  useInView,
} from "framer-motion";
import { MapContainer, TileLayer, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* ─────────────────────────────────────────────────────────────
   BRAND / CONSTANTS
───────────────────────────────────────────────────────────── */
const BRAND = "#9cc72b";

const TEX_COLOR =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r168/examples/textures/planets/earth_atmos_2048.jpg";
const TEX_NORMAL =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r168/examples/textures/planets/earth_normal_2048.jpg";

const SECTOR_STYLE = {
  Industrial: { pill: "rgba(156,199,43,0.15)", text: "#3d5e10", marker: BRAND },
  Commercial: {
    pill: "rgba(15,23,42,0.07)",
    text: "#334155",
    marker: "#94a3b8",
  },
  Other: { pill: "rgba(59,130,246,0.1)", text: "#1d4ed8", marker: "#60a5fa" },
};

const STATUS_STYLE = {
  "Under Development": { pill: "rgba(245,158,11,0.15)", text: "#92400e" },
  Active: { pill: "rgba(156,199,43,0.12)", text: "#3a5e12" },
  Realized: { pill: "rgba(100,116,139,0.12)", text: "#475569" },
};

const STAGE_OPTIONS = ["All", "Current", "Realized"];
const SECTOR_OPTIONS = ["All", "Industrial", "Commercial", "Other"];

const FOOTER_STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const FOOTER_ITEM = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const RAW_PROPERTIES = [
  {
    id: 2295,
    name: "Greens Storage",
    location: "Fairfield, CA",
    country: "USA",
    lat: 38.2915507,
    lon: -121.9695727,
    categories: ["Current", "Industrial"],
  },
  {
    id: 2280,
    name: "Greens Storage",
    location: "Lakeside, CA",
    country: "USA",
    lat: 32.86,
    lon: -116.92,
    categories: ["Current", "Commercial"],
  },
  {
    id: 1797,
    name: "Innopolis",
    location: "Genome Valley, Hyderabad, India",
    country: "India",
    lat: 17.59,
    lon: 78.48,
    categories: ["Current", "Industrial", "Under Development"],
  },
  {
    id: 1752,
    name: "Greens Storage",
    location: "Georgetown, TX",
    country: "USA",
    lat: 30.63,
    lon: -97.68,
    categories: ["Current", "Industrial"],
  },
  {
    id: 1700,
    name: "CubeSmart",
    location: "Sachse, TX",
    country: "USA",
    lat: 32.98,
    lon: -96.6,
    categories: ["Current", "Industrial"],
  },
  {
    id: 1050,
    name: "Greens Heritage Square",
    location: "Menifee, CA",
    country: "USA",
    lat: 33.7,
    lon: -117.17,
    categories: ["Current", "Commercial", "Under Development"],
  },
  {
    id: 1401,
    name: "CubeSmart",
    location: "Austin, TX",
    country: "USA",
    lat: 30.27,
    lon: -97.74,
    categories: ["Current", "Industrial"],
  },
  {
    id: 1374,
    name: "Greens Storage",
    location: "Menifee, CA",
    country: "USA",
    lat: 33.71,
    lon: -117.18,
    categories: ["Current", "Commercial", "Under Development"],
  },
  {
    id: 902,
    name: "Greens Storage",
    location: "Valley Center, CA",
    country: "USA",
    lat: 33.22,
    lon: -116.96,
    categories: ["Current", "Industrial"],
  },
  {
    id: 1224,
    name: "Genopolis",
    location: "Genome Valley, Hyderabad, India",
    country: "India",
    lat: 17.6,
    lon: 78.49,
    categories: ["Current", "Industrial", "Under Development"],
  },
  {
    id: 1048,
    name: "Greens Storage Expansion",
    location: "Valley Center, CA",
    country: "USA",
    lat: 33.21,
    lon: -116.95,
    categories: ["Current", "Industrial", "Under Development"],
  },
  {
    id: 967,
    name: "Taco Bell",
    location: "San Clemente, CA",
    country: "USA",
    lat: 33.43,
    lon: -117.61,
    categories: ["Current", "Commercial"],
  },
  {
    id: 961,
    name: "Quality Inn & Suites",
    location: "Washington, UT",
    country: "USA",
    lat: 37.13,
    lon: -113.51,
    categories: ["Current", "Commercial"],
  },
  {
    id: 959,
    name: "Greens Storage",
    location: "Escondido, CA",
    country: "USA",
    lat: 33.1683923,
    lon: -117.1053057,
    categories: ["Current", "Industrial"],
  },
  {
    id: 956,
    name: "Greens Storage",
    location: "Temecula, CA",
    country: "USA",
    lat: 33.49,
    lon: -117.15,
    categories: ["Current", "Industrial"],
  },
  {
    id: 948,
    name: "San Clemente Medi-Center",
    location: "San Clemente, CA",
    country: "USA",
    lat: 33.44,
    lon: -117.62,
    categories: ["Current", "Commercial"],
  },
  {
    id: 945,
    name: "Chipotle",
    location: "Chicago, IL",
    country: "USA",
    lat: 41.88,
    lon: -87.63,
    categories: ["Current", "Commercial"],
  },
  {
    id: 940,
    name: "Mattress Firm",
    location: "Chicago, IL",
    country: "USA",
    lat: 41.87,
    lon: -87.62,
    categories: ["Current", "Commercial"],
  },
  {
    id: 933,
    name: "Ramky Selenium",
    location: "Hyderabad, India",
    country: "India",
    lat: 17.39,
    lon: 78.49,
    categories: ["Current", "Commercial"],
  },
  {
    id: 931,
    name: "Greens Storage",
    location: "Murrieta, CA",
    country: "USA",
    lat: 33.55,
    lon: -117.21,
    categories: ["Current", "Industrial"],
  },
  {
    id: 897,
    name: "Greens Towers",
    location: "Hyderabad, India",
    country: "India",
    lat: 17.38,
    lon: 78.48,
    categories: ["Current", "Commercial"],
  },
  {
    id: 882,
    name: "Wells Fargo",
    location: "San Antonio, TX",
    country: "USA",
    lat: 29.42,
    lon: -98.49,
    categories: ["Current", "Commercial"],
  },
  {
    id: 1576,
    name: "Creative Office Space",
    location: "Freestone, CA",
    country: "USA",
    lat: 38.35,
    lon: -122.11,
    categories: ["Current", "Commercial"],
  },
  {
    id: 1372,
    name: "Greens Storage",
    location: "Escondido (North), CA",
    country: "USA",
    lat: 33.18,
    lon: -117.08,
    categories: ["Current", "Industrial", "Under Development"],
  },
  {
    id: 1369,
    name: "Greens Storage",
    location: "Mammoth Lakes, CA",
    country: "USA",
    lat: 37.65,
    lon: -118.97,
    categories: ["Current", "Industrial", "Under Development"],
  },
  {
    id: 1499,
    name: "Ethanol Factory",
    location: "Sterling, CO",
    country: "USA",
    lat: 40.63,
    lon: -103.21,
    categories: ["Current", "Industrial"],
  },
  {
    id: 1474,
    name: "Ethanol Factory",
    location: "Lyons, KS",
    country: "USA",
    lat: 38.35,
    lon: -98.2,
    categories: ["Current", "Industrial"],
  },
  {
    id: 1080,
    name: "CK Commercial Shopping Center",
    location: "Hyderabad, India",
    country: "India",
    lat: 17.4,
    lon: 78.5,
    categories: ["Realized", "Commercial"],
  },
  {
    id: 1074,
    name: "Comfort Inn",
    location: "St. George, UT",
    country: "USA",
    lat: 37.1,
    lon: -113.58,
    categories: ["Realized", "Commercial"],
  },
  {
    id: 1385,
    name: "Del Taco",
    location: "Henderson, NV",
    country: "USA",
    lat: 36.04,
    lon: -114.98,
    categories: ["Realized", "Commercial"],
  },
  {
    id: 1078,
    name: "Jackson Shopping Development",
    location: "Jackson, MS",
    country: "USA",
    lat: 32.3,
    lon: -90.18,
    categories: ["Realized", "Commercial"],
  },
  {
    id: 1169,
    name: "Justa Hotels",
    location: "Hyderabad, India",
    country: "India",
    lat: 17.41,
    lon: 78.51,
    categories: ["Realized", "Commercial"],
  },
  {
    id: 1480,
    name: "Oil Wells",
    location: "Silsbee, TX",
    country: "USA",
    lat: 30.35,
    lon: -94.18,
    categories: ["Realized"],
  },
  {
    id: 1076,
    name: "Palmilla Shopping Center",
    location: "Riverside, CA",
    country: "USA",
    lat: 33.98,
    lon: -117.38,
    categories: ["Realized", "Commercial"],
  },
  {
    id: 935,
    name: "Popeye's",
    location: "Tulsa, OK",
    country: "USA",
    lat: 36.15,
    lon: -95.99,
    categories: ["Realized", "Commercial"],
  },
];

function normalizeProperty(p) {
  const stage = p.categories.includes("Realized") ? "Realized" : "Current";
  const sector = p.categories.includes("Industrial")
    ? "Industrial"
    : p.categories.includes("Commercial")
      ? "Commercial"
      : "Other";
  const status = p.categories.includes("Under Development")
    ? "Under Development"
    : stage === "Realized"
      ? "Realized"
      : "Active";
  return { ...p, stage, sector, status };
}

const PROPERTIES = RAW_PROPERTIES.map(normalizeProperty);
const TOTAL_COUNT = PROPERTIES.length;
const CURRENT_COUNT = PROPERTIES.filter((p) => p.stage === "Current").length;
const REALIZED_COUNT = PROPERTIES.filter((p) => p.stage === "Realized").length;
const PIPELINE_COUNT = PROPERTIES.filter(
  (p) => p.status === "Under Development"
).length;

/* ─────────────────────────────────────────────────────────────
   UTILITY
───────────────────────────────────────────────────────────── */
function latLonToVec3(lat, lon, r = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

/* ─────────────────────────────────────────────────────────────
   UI COMPONENTS
───────────────────────────────────────────────────────────── */
function StatCounter({ value, suffix = "", label }) {
  const ref = useRef(null);
  const mv = useMotionValue(0);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(mv, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString()),
    });
    return ctrl.stop;
  }, [inView, value, mv]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center px-4 lg:px-6"
    >
      <span className="text-2xl font-bold leading-none text-slate-900 lg:text-3xl">
        {display}
        {suffix}
      </span>
      <span
        className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.22em]"
        style={{ color: "rgba(15,23,42,0.42)" }}
      >
        {label}
      </span>
    </div>
  );
}

function FilterChip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-200 shrink-0"
      style={{
        background: active ? BRAND : "rgba(255,255,255,0.9)",
        color: active ? "#13210f" : "rgba(15,23,42,0.55)",
        boxShadow: active
          ? "0 4px 14px rgba(156,199,43,0.28)"
          : "inset 0 0 0 1px rgba(15,23,42,0.1)",
      }}
    >
      {children}
    </button>
  );
}

function PropertyCard({ property, active, onClick, onHover, onLeave }) {
  const sec = SECTOR_STYLE[property.sector] ?? SECTOR_STYLE.Other;
  const sts = STATUS_STYLE[property.status] ?? STATUS_STYLE.Active;

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.997 }}
      className="group w-full text-left rounded-2xl overflow-hidden relative"
      style={{
        background: "#fff",
        border: active
          ? "1px solid rgba(156,199,43,0.45)"
          : "1px solid rgba(15,23,42,0.08)",
        boxShadow: active
          ? "0 8px 24px rgba(156,199,43,0.14), 0 2px 6px rgba(15,23,42,0.06)"
          : "0 2px 8px rgba(15,23,42,0.05)",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl transition-all duration-300"
        style={{ background: active ? BRAND : "transparent" }}
      />
      <div className="px-4 py-3.5 pl-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ background: sec.pill, color: sec.text }}
            >
              {property.sector}
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ background: sts.pill, color: sts.text }}
            >
              {property.status}
            </span>
          </div>
          <span
            className="text-[10px] font-semibold shrink-0"
            style={{ color: "rgba(15,23,42,0.28)" }}
          >
            #{property.id}
          </span>
        </div>
        <h3 className="mt-2.5 text-[15px] font-bold leading-snug text-slate-900">
          {property.name}
        </h3>
        <p
          className="mt-0.5 text-[12px]"
          style={{ color: "rgba(15,23,42,0.52)" }}
        >
          {property.location}
        </p>
        <div
          className="mt-3 flex items-center justify-between border-t pt-3"
          style={{ borderColor: "rgba(15,23,42,0.07)" }}
        >
          <span
            className="text-[10px] font-medium"
            style={{ color: "rgba(15,23,42,0.38)" }}
          >
            {property.country}
          </span>
          <span
            className="text-[11px] font-bold transition-colors duration-200"
            style={{ color: active ? BRAND : "rgba(15,23,42,0.35)" }}
          >
            View on map →
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function SelectedOverlay({ property, onClose }) {
  if (!property) return null;
  const sec = SECTOR_STYLE[property.sector] ?? SECTOR_STYLE.Other;
  const sts = STATUS_STYLE[property.status] ?? STATUS_STYLE.Active;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(156,199,43,0.25)",
        boxShadow: "0 20px 48px rgba(15,23,42,0.14)",
      }}
    >
      <div
        className="h-28 w-full flex flex-col items-center justify-center gap-2"
        style={{
          background: "linear-gradient(135deg, #eef5e7 0%, #ddecd3 100%)",
          borderBottom: "1px solid rgba(15,23,42,0.07)",
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(156,199,43,0.65)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="7" width="18" height="14" rx="1" />
          <path d="M8 21V11h8v10M3 7l9-4 9 4" />
          <rect x="10" y="14" width="4" height="4" />
        </svg>
        <span
          className="text-[9px] font-bold uppercase tracking-[0.2em]"
          style={{ color: "rgba(156,199,43,0.72)" }}
        >
          Property Image
        </span>
      </div>
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ background: sec.pill, color: sec.text }}
            >
              {property.sector}
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ background: sts.pill, color: sts.text }}
            >
              {property.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold"
            style={{
              background: "rgba(15,23,42,0.07)",
              color: "rgba(15,23,42,0.5)",
            }}
          >
            ×
          </button>
        </div>
        <h2 className="mt-3 text-lg font-bold leading-tight text-slate-900">
          {property.name}
        </h2>
        <p
          className="mt-1 text-[12px]"
          style={{ color: "rgba(15,23,42,0.52)" }}
        >
          {property.location}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { v: property.stage, l: "Stage" },
            { v: property.country, l: "Country" },
            { v: `#${property.id}`, l: "Record" },
          ].map(({ v, l }) => (
            <div
              key={l}
              className="rounded-xl px-2.5 py-2"
              style={{ background: "rgba(15,23,42,0.05)" }}
            >
              <p className="text-[11px] font-bold text-slate-800 leading-none">
                {v}
              </p>
              <p
                className="mt-1 text-[9px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(15,23,42,0.38)" }}
              >
                {l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PropertyListCard({ property, onClick }) {
  const sec = SECTOR_STYLE[property.sector] ?? SECTOR_STYLE.Other;
  const sts = STATUS_STYLE[property.status] ?? STATUS_STYLE.Active;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
      }}
    >
      {/* Image placeholder */}
      <div
        className="h-32 w-full flex flex-col items-center justify-center gap-2"
        style={{
          background: "linear-gradient(135deg, #f0f4ec 0%, #e4eede 100%)",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(156,199,43,0.55)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="7" width="18" height="14" rx="1" />
          <path d="M8 21V11h8v10M3 7l9-4 9 4" />
          <rect x="10" y="14" width="4" height="4" />
        </svg>
        <span
          className="text-[9px] font-bold uppercase tracking-[0.2em]"
          style={{ color: "rgba(156,199,43,0.6)" }}
        >
          {property.country}
        </span>
      </div>
      {/* Details */}
      <div className="px-3.5 py-3">
        <div className="flex flex-wrap gap-1.5">
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]"
            style={{ background: sec.pill, color: sec.text }}
          >
            {property.sector}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]"
            style={{ background: sts.pill, color: sts.text }}
          >
            {property.status}
          </span>
        </div>
        <h3 className="mt-2 text-[13px] font-bold leading-snug text-slate-900">
          {property.name}
        </h3>
        <p
          className="mt-0.5 text-[11px]"
          style={{ color: "rgba(15,23,42,0.48)" }}
        >
          {property.location}
        </p>
        <div
          className="mt-2.5 flex items-center justify-between border-t pt-2.5"
          style={{ borderColor: "rgba(15,23,42,0.07)" }}
        >
          <span
            className="text-[10px] font-medium"
            style={{ color: "rgba(15,23,42,0.35)" }}
          >
            #{property.id}
          </span>
          <span className="text-[10px] font-bold" style={{ color: BRAND }}>
            View details →
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function PropertyDetailModal({
  property,
  onClose,
  onViewMap,
  onViewInteractive,
}) {
  if (!property) return null;
  const sec = SECTOR_STYLE[property.sector] ?? SECTOR_STYLE.Other;
  const sts = STATUS_STYLE[property.status] ?? STATUS_STYLE.Active;
  const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${property.lat},${property.lon}`;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[900] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: "#fff",
          boxShadow: "0 32px 80px rgba(15,23,42,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image placeholder */}
        <div
          className="h-44 w-full flex flex-col items-center justify-center gap-3"
          style={{
            background: "linear-gradient(135deg, #eef5e7 0%, #ddecd3 100%)",
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(156,199,43,0.6)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="7" width="18" height="14" rx="1" />
            <path d="M8 21V11h8v10M3 7l9-4 9 4" />
            <rect x="10" y="14" width="4" height="4" />
          </svg>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.24em]"
            style={{ color: "rgba(156,199,43,0.7)" }}
          >
            Property Image
          </span>
        </div>
        {/* Content */}
        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ background: sec.pill, color: sec.text }}
              >
                {property.sector}
              </span>
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ background: sts.pill, color: sts.text }}
              >
                {property.status}
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{
                background: "rgba(15,23,42,0.07)",
                color: "rgba(15,23,42,0.45)",
              }}
            >
              ×
            </button>
          </div>
          <h2 className="mt-3 text-xl font-bold text-slate-900">
            {property.name}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "rgba(15,23,42,0.52)" }}>
            {property.location}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              { v: property.stage, l: "Stage" },
              { v: property.country, l: "Country" },
              { v: `#${property.id}`, l: "Record" },
            ].map(({ v, l }) => (
              <div
                key={l}
                className="rounded-xl px-3 py-2.5 text-center"
                style={{ background: "rgba(15,23,42,0.04)" }}
              >
                <p className="text-[12px] font-bold text-slate-800">{v}</p>
                <p
                  className="mt-0.5 text-[9px] uppercase tracking-[0.18em]"
                  style={{ color: "rgba(15,23,42,0.38)" }}
                >
                  {l}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <a
              href={googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-2xl py-3 text-center text-[13px] font-bold tracking-wide transition-all duration-200"
              style={{
                background: "rgba(15,23,42,0.08)",
                color: "#0f172a",
              }}
            >
              Open in Google Maps
            </a>
            <button
              onClick={onViewInteractive ?? onViewMap}
              className="w-full rounded-2xl py-3 text-[13px] font-bold tracking-wide transition-all duration-200"
              style={{
                background: BRAND,
                color: "#fff",
                boxShadow: "0 4px 16px rgba(156,199,43,0.35)",
              }}
            >
              View on Interactive Map →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   THREE.JS GLOBE COMPONENTS
───────────────────────────────────────────────────────────── */

/** Earth sphere with NASA textures (inside Suspense) */
function EarthTextured() {
  const [colorMap, normalMap] = useTexture([TEX_COLOR, TEX_NORMAL]);
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        metalness={0.05}
        roughness={0.75}
      />
    </mesh>
  );
}

/** Fallback sphere shown while textures load */
function EarthFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#1a3a6b" roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

/** Single property pin on the globe */
function GlobePin({ property, selected, hovered, onSelect, onHover, onLeave }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const beamRef = useRef();
  const groupRef = useRef();
  const { camera } = useThree();
  const worldPos = useRef(new THREE.Vector3());
  const frontNormal = useRef(new THREE.Vector3());
  const pos = useMemo(
    () =>
      latLonToVec3(
        property.displayLat ?? property.lat,
        property.displayLon ?? property.lon,
        1.015
      ),
    [property.displayLat, property.displayLon, property.lat, property.lon]
  );
  const color = hovered || selected ? "#c9ff52" : BRAND;

  useFrame(({ clock }) => {
    if (!meshRef.current || !groupRef.current) return;

    groupRef.current.getWorldPosition(worldPos.current);
    frontNormal.current.copy(worldPos.current).normalize();
    const cameraDir = camera.position.clone().normalize();
    const facing = Math.max(0, frontNormal.current.dot(cameraDir));
    const lodOpacity = 0.16 + facing * 0.9;

    const breathing =
      1 + Math.sin(clock.elapsedTime * 2.8 + property.id) * 0.07;
    const hoverBoost = hovered ? 1.22 : 1;
    const selectBoost = selected ? 1.35 : 1;
    meshRef.current.scale.setScalar(breathing * hoverBoost * selectBoost);

    if (ringRef.current) {
      const ringPulse =
        1 + Math.sin(clock.elapsedTime * 3.5 + property.id) * 0.18;
      ringRef.current.scale.setScalar(
        (selected ? 1.7 : hovered ? 1.3 : 1.08) * ringPulse
      );
      ringRef.current.material.opacity =
        (selected ? 0.5 : hovered ? 0.38 : 0.22) * lodOpacity;
    }

    if (beamRef.current) {
      beamRef.current.material.opacity =
        (selected ? 0.22 : hovered ? 0.14 : 0.08) * lodOpacity;
      beamRef.current.scale.y = selected ? 1.18 : hovered ? 1.04 : 0.9;
    }

    meshRef.current.material.opacity =
      (selected ? 1 : hovered ? 0.95 : 0.86) * lodOpacity;
    meshRef.current.material.emissiveIntensity = selected
      ? 1.6
      : hovered
        ? 1.15
        : 0.72;
  });

  return (
    <group ref={groupRef} position={pos}>
      <mesh
        ref={beamRef}
        position={[0, 0.04, 0]}
        quaternion={new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          pos.clone().normalize()
        )}
      >
        <cylinderGeometry args={[0.003, 0.009, 0.22, 10, 1, true]} />
        <meshBasicMaterial
          color={BRAND}
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(property.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(property.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onLeave();
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry
          args={[selected ? 0.016 : hovered ? 0.013 : 0.011, 14, 14]}
        />
        <meshStandardMaterial
          transparent
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 1.6 : hovered ? 1.15 : 0.72}
        />
      </mesh>

      <mesh ref={ringRef}>
        <ringGeometry args={[0.017, 0.024, 24]} />
        <meshBasicMaterial
          color={BRAND}
          transparent
          opacity={0.26}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Hover tooltip */}
      {hovered && (
        <Html
          position={[0.085, 0.05, 0]}
          transform={false}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              position: "relative",
              background:
                "linear-gradient(160deg, rgba(16, 25, 42, 0.74), rgba(19, 36, 56, 0.6))",
              backdropFilter: "blur(12px)",
              color: "#e8f0ff",
              padding: "6px 9px",
              borderRadius: "10px",
              maxWidth: "156px",
              whiteSpace: "normal",
              border: "1px solid rgba(148, 163, 184, 0.22)",
              boxShadow: "0 10px 26px rgba(2, 6, 23, 0.42)",
              lineHeight: 1.2,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "12px",
                bottom: "-9px",
                width: "1px",
                height: "9px",
                background: "rgba(148,163,184,0.46)",
              }}
            />
            <div style={{ fontSize: "9px", fontWeight: 700, lineHeight: 1.15 }}>
              {property.name}
            </div>
            <div
              style={{
                fontSize: "7px",
                fontWeight: 500,
                lineHeight: 1.2,
                opacity: 0.76,
                marginTop: "3px",
                letterSpacing: "0.01em",
              }}
            >
              {property.location}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * Handles globe rotation + camera zoom animation.
 * Phases: idle → rotating → zooming → done (calls onReady)
 */
function GlobeAnimator({ globeRef, selectedProperty, hoveredId, onReady }) {
  const { camera } = useThree();
  const targetQ = useRef(new THREE.Quaternion());
  const phase = useRef("idle");
  const lastId = useRef(null);
  const homeCameraPos = useMemo(() => new THREE.Vector3(0, 0, 2.5), []);
  const zoomCameraPos = useMemo(() => new THREE.Vector3(0, 0, 1.04), []);

  useEffect(() => {
    if (!selectedProperty) {
      phase.current = "idle";
      lastId.current = null;
      camera.position.copy(homeCameraPos);
      camera.lookAt(0, 0, 0);
      return;
    }
    if (selectedProperty.id === lastId.current) return;
    lastId.current = selectedProperty.id;
    // Compute absolute quaternion that rotates globe so this lat/lon faces camera (+Z)
    const dir = latLonToVec3(
      selectedProperty.displayLat ?? selectedProperty.lat,
      selectedProperty.displayLon ?? selectedProperty.lon,
      1
    ).normalize();
    targetQ.current.setFromUnitVectors(dir, new THREE.Vector3(0, 0, 1));
    // Always normalize camera orientation before rotating so selected pin centers reliably.
    phase.current = "recentering";
  }, [selectedProperty, camera, homeCameraPos]);

  useFrame(() => {
    const globe = globeRef.current;
    if (!globe) return;

    if (phase.current === "idle") {
      if (!hoveredId) {
        globe.rotation.y += 0.0012;
      }
      return;
    }

    if (phase.current === "recentering") {
      camera.position.lerp(homeCameraPos, 0.14);
      camera.lookAt(0, 0, 0);
      if (camera.position.distanceTo(homeCameraPos) < 0.004) {
        camera.position.copy(homeCameraPos);
        phase.current = "rotating";
      }
      return;
    }

    if (phase.current === "rotating") {
      const diff = globe.quaternion.angleTo(targetQ.current);
      if (diff > 0.005) {
        globe.quaternion.slerp(targetQ.current, 0.06);
      } else {
        globe.quaternion.copy(targetQ.current);
        phase.current = "zooming";
      }
      return;
    }

    if (phase.current === "zooming") {
      camera.position.lerp(zoomCameraPos, 0.08);
      camera.lookAt(0, 0, 0);
      if (camera.position.distanceTo(zoomCameraPos) > 0.003) {
        return;
      } else {
        camera.position.copy(zoomCameraPos);
        phase.current = "done";
        onReady();
      }
    }
  });

  return null;
}

/** Full Three.js scene inside Canvas */
function GlobeScene({
  properties,
  selectedProperty,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  onLeave,
  onReady,
  orbitEnabled,
}) {
  const globeRef = useRef();

  return (
    <>
      <color attach="background" args={["#1a2d4a"]} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[6, 3, 5]} intensity={1.4} color="#fffef5" />
      <directionalLight
        position={[-5, -2, -3]}
        intensity={0.8}
        color="#d0e8ff"
      />
      <Stars
        radius={120}
        depth={50}
        count={1800}
        factor={2.1}
        saturation={0}
        fade
        speed={0.12}
      />

      <group ref={globeRef}>
        {/* Earth */}
        <Suspense fallback={<EarthFallback />}>
          <EarthTextured />
        </Suspense>
        {/* Thin atmosphere glow */}
        <mesh>
          <sphereGeometry args={[1.028, 32, 32]} />
          <meshStandardMaterial
            color="#6ab0ff"
            transparent
            opacity={0.07}
            side={THREE.BackSide}
          />
        </mesh>
        {/* Property pins */}
        {properties.map((p) => (
          <GlobePin
            key={p.id}
            property={p}
            selected={p.id === selectedId}
            hovered={p.id === hoveredId}
            onSelect={onSelect}
            onHover={onHover}
            onLeave={onLeave}
          />
        ))}
      </group>

      <GlobeAnimator
        globeRef={globeRef}
        selectedProperty={selectedProperty}
        hoveredId={hoveredId}
        onReady={onReady}
      />

      <OrbitControls
        enabled={orbitEnabled}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.45}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   LEAFLET COMPONENTS
───────────────────────────────────────────────────────────── */
function FlyToSelected({ property }) {
  const map = useMap();
  useEffect(() => {
    if (!property) return;
    map.flyTo(
      [
        property.displayLat ?? property.lat,
        property.displayLon ?? property.lon,
      ],
      15,
      {
        duration: 1.4,
        easeLinearity: 0.2,
      }
    );
  }, [map, property?.id]);
  return null;
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function PortfolioPage() {
  const [viewMode, setViewMode] = useState("interactive");
  // "globe" = 3D globe visible | "map" = Leaflet map visible
  const [phase, setPhase] = useState("globe");
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const [modalPropertyId, setModalPropertyId] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("All");
  const [sector, setSector] = useState("All");
  const [country, setCountry] = useState("All");
  const deferredSearch = useDeferredValue(search);
  const cardRefs = useRef({});

  const countries = useMemo(
    () => ["All", ...new Set(PROPERTIES.map((p) => p.country))],
    []
  );

  const filtered = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return PROPERTIES.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q);
      return (
        matchSearch &&
        (stage === "All" || p.stage === stage) &&
        (sector === "All" || p.sector === sector) &&
        (country === "All" || p.country === country)
      );
    });
  }, [deferredSearch, stage, sector, country]);

  /* Jitter co-located pins for the map view */
  const displayProperties = useMemo(() => {
    const groups = new Map();
    filtered.forEach((p) => {
      const k = `${p.lat.toFixed(4)}:${p.lon.toFixed(4)}`;
      const arr = groups.get(k) ?? [];
      arr.push(p);
      groups.set(k, arr);
    });
    const result = [];
    groups.forEach((grp) => {
      if (grp.length === 1) {
        result.push({
          ...grp[0],
          displayLat: grp[0].lat,
          displayLon: grp[0].lon,
        });
      } else {
        grp.forEach((p, i) => {
          const angle = (Math.PI * 2 * i) / grp.length;
          result.push({
            ...p,
            displayLat: p.lat + Math.sin(angle) * 0.014,
            displayLon: p.lon + Math.cos(angle) * 0.014,
          });
        });
      }
    });
    return result;
  }, [filtered]);

  useEffect(() => {
    if (selectedId && !filtered.some((p) => p.id === selectedId))
      setSelectedId(null);
  }, [filtered, selectedId]);

  const selectedProperty =
    filtered.find((p) => p.id === selectedId) ??
    PROPERTIES.find((p) => p.id === selectedId) ??
    null;
  const selectedDisplayProperty =
    displayProperties.find((p) => p.id === selectedId) ?? selectedProperty;
  const modalProperty =
    filtered.find((p) => p.id === modalPropertyId) ??
    PROPERTIES.find((p) => p.id === modalPropertyId) ??
    null;
  const hasFilters =
    search.trim() || stage !== "All" || sector !== "All" || country !== "All";

  /** Called from globe pin click or card click while in globe phase */
  const handleGlobeSelect = useCallback((id) => {
    setSelectedId(id);
    setOrbitEnabled(false);
    requestAnimationFrame(() => {
      cardRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }, []);

  /** Called when the globe zoom-in animation finishes — switch to map */
  const handleTransitionReady = useCallback(() => {
    setPhase("map");
  }, []);

  /** In map phase: just fly to new property */
  const handleMapSelect = useCallback((id) => {
    setSelectedId(id);
    requestAnimationFrame(() => {
      cardRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }, []);

  const handleBackToGlobe = useCallback(() => {
    setPhase("globe");
    setSelectedId(null);
    setOrbitEnabled(true);
  }, []);

  const handleCardClick = useCallback(
    (id) => {
      if (viewMode === "list") {
        setModalPropertyId(id);
        return;
      }
      if (phase === "map") {
        handleMapSelect(id);
      } else {
        handleGlobeSelect(id);
      }
    },
    [phase, viewMode, handleGlobeSelect, handleMapSelect]
  );

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    setHoveredId(null);
    if (mode === "list") {
      setPhase("globe");
      setSelectedId(null);
      setOrbitEnabled(true);
      return;
    }
    setModalPropertyId(null);
  }, []);

  const openPropertyInInteractiveMap = useCallback((id) => {
    setModalPropertyId(null);
    setViewMode("interactive");
    setSelectedId(id);
    setPhase("map");
    setOrbitEnabled(false);
    requestAnimationFrame(() => {
      cardRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-screen flex-col overflow-hidden"
      style={{ background: "#f1f5ee", paddingTop: "4rem" }}
    >
      {/* ── DARK HERO ────────────────────────────────────── */}
      <header
        className="shrink-0 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #f8faf5 0%, #edf5e5 60%, #f4f9f0 100%)",
          borderBottom: "1px solid rgba(156,199,43,0.18)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 8% 50%, rgba(156,199,43,0.09) 0%, transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #9cc72b 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto max-w-screen-xl px-5 py-6 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="h-px w-5 shrink-0"
                  style={{ background: BRAND }}
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.28em]"
                  style={{ color: BRAND }}
                >
                  GG · Portfolio
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 lg:text-4xl">
                Our Portfolio
              </h1>
              <p
                className="mt-1.5 max-w-md text-sm leading-relaxed"
                style={{ color: "rgba(15,23,42,0.52)" }}
              >
                Current and realized assets across industrial, commercial, and
                life sciences real estate.
              </p>
            </div>
            <div
              className="flex items-center rounded-2xl px-2 py-3 lg:px-4"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(15,23,42,0.09)",
                boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
              }}
            >
              {[
                { value: TOTAL_COUNT, label: "Total Assets" },
                { value: CURRENT_COUNT, label: "Current" },
                { value: REALIZED_COUNT, label: "Realized" },
                { value: PIPELINE_COUNT, label: "In Pipeline" },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center">
                  {i > 0 && (
                    <div
                      className="h-8 w-px mx-1 shrink-0"
                      style={{ background: "rgba(15,23,42,0.1)" }}
                    />
                  )}
                  <StatCounter value={s.value} label={s.label} />
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-3 rounded-2xl px-3 py-2"
            style={{
              background: "rgba(255,255,255,0.86)",
              border: "1px solid rgba(15,23,42,0.09)",
              boxShadow: "0 4px 16px rgba(15,23,42,0.05)",
            }}
          >
            <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
              <div className="relative min-w-[220px] flex-1">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="rgba(15,23,42,0.35)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="9" r="6" />
                  <path d="m17 17-3.5-3.5" />
                </svg>
                <input
                  value={search}
                  onChange={(e) =>
                    startTransition(() => setSearch(e.target.value))
                  }
                  placeholder="Search properties..."
                  className="w-full rounded-[12px] py-2 pl-9 pr-3 text-[12px] outline-none"
                  style={{
                    background: "rgba(15,23,42,0.04)",
                    border: "1px solid rgba(15,23,42,0.09)",
                    color: "#0f172a",
                  }}
                />
              </div>

              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="rounded-[12px] px-3 py-2 text-[12px] font-semibold outline-none"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(15,23,42,0.12)",
                  color: "rgba(15,23,42,0.7)",
                }}
              >
                {STAGE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    Stage: {o}
                  </option>
                ))}
              </select>

              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="rounded-[12px] px-3 py-2 text-[12px] font-semibold outline-none"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(15,23,42,0.12)",
                  color: "rgba(15,23,42,0.7)",
                }}
              >
                {SECTOR_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    Sector: {o}
                  </option>
                ))}
              </select>

              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="rounded-[12px] px-3 py-2 text-[12px] font-semibold outline-none"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(15,23,42,0.12)",
                  color: "rgba(15,23,42,0.7)",
                }}
              >
                {countries.map((o) => (
                  <option key={o} value={o}>
                    Region: {o}
                  </option>
                ))}
              </select>

              {hasFilters && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStage("All");
                    setSector("All");
                    setCountry("All");
                  }}
                  className="text-[11px] font-semibold whitespace-nowrap"
                  style={{ color: "rgba(15,23,42,0.46)" }}
                >
                  Reset
                </button>
              )}

              <p
                className="text-[11px] whitespace-nowrap"
                style={{ color: "rgba(15,23,42,0.52)" }}
              >
                <span className="font-bold text-slate-900">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "property" : "properties"}
              </p>

              <div className="lg:ml-auto">
                <div
                  className="inline-flex rounded-full p-1"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(15,23,42,0.1)",
                  }}
                >
                  {[
                    { key: "interactive", label: "Interactive" },
                    { key: "list", label: "List View" },
                  ].map((opt) => {
                    const active = viewMode === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleViewModeChange(opt.key)}
                        className="rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-200"
                        style={{
                          background: active ? BRAND : "transparent",
                          color: active ? "#13210f" : "rgba(15,23,42,0.52)",
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN SPLIT ───────────────────────────────────── */}
      {viewMode === "interactive" ? (
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 p-3">
          {/* LEFT: Globe canvas + Map (layered, crossfade) */}
          <div
            className="relative lg:flex-1 rounded-3xl overflow-hidden"
            style={{ minHeight: 300 }}
          >
            {/* ── 3D GLOBE ── */}
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: phase === "map" ? 0 : 1 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              style={{ pointerEvents: phase === "map" ? "none" : "auto" }}
            >
              <Canvas
                camera={{ position: [0, 0, 2.5], fov: 45 }}
                dpr={[1, 1.8]}
                style={{ background: "#04090f" }}
              >
                <GlobeScene
                  properties={displayProperties}
                  selectedProperty={
                    phase === "map" ? null : selectedDisplayProperty
                  }
                  selectedId={selectedId}
                  hoveredId={hoveredId}
                  onSelect={handleGlobeSelect}
                  onHover={setHoveredId}
                  onLeave={() => setHoveredId(null)}
                  onReady={handleTransitionReady}
                  orbitEnabled={orbitEnabled}
                />
              </Canvas>
              {/* Globe hint */}
              {!selectedId && (
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div
                    className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      color: "rgba(255,255,255,0.45)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    Drag to rotate · Click pin to explore
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── LEAFLET MAP ── */}
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: phase === "map" ? 1 : 0 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              style={{ pointerEvents: phase === "map" ? "auto" : "none" }}
            >
              {/* Mount map eagerly so it's ready when transition fires */}
              {selectedProperty && (
                <MapContainer
                  center={[
                    selectedDisplayProperty?.displayLat ?? selectedProperty.lat,
                    selectedDisplayProperty?.displayLon ?? selectedProperty.lon,
                  ]}
                  zoom={15}
                  minZoom={2}
                  maxZoom={19}
                  scrollWheelZoom
                  touchZoom
                  dragging
                  doubleClickZoom
                  zoomControl
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    subdomains="abcd"
                  />
                  <FlyToSelected property={selectedDisplayProperty} />
                  {displayProperties.map((p) => {
                    const selected = p.id === selectedId;
                    const hovered = p.id === hoveredId;
                    const sec = SECTOR_STYLE[p.sector] ?? SECTOR_STYLE.Other;
                    return (
                      <CircleMarker
                        key={p.id}
                        center={[p.displayLat, p.displayLon]}
                        radius={selected ? 10 : hovered ? 8 : 6}
                        pathOptions={{
                          color: selected ? "#0f172a" : sec.marker,
                          fillColor: selected ? "#0f172a" : sec.marker,
                          fillOpacity: selected ? 0.95 : 0.75,
                          weight: selected ? 2.5 : 1.5,
                        }}
                        eventHandlers={{
                          click: () => handleMapSelect(p.id),
                          mouseover: () => setHoveredId(p.id),
                          mouseout: () => setHoveredId(null),
                        }}
                      />
                    );
                  })}
                </MapContainer>
              )}

              {/* Back-to-globe button */}
              <button
                onClick={handleBackToGlobe}
                className="absolute top-4 left-4 z-[500] flex items-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  color: BRAND,
                  border: "1px solid rgba(156,199,43,0.3)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 16px rgba(15,23,42,0.12)",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2z" />
                  <path d="M10 6c-2.2.8-3.8 2-4.5 4M6 14c1 .8 2.5 1.3 4 1.3M14 8c.5 1 .8 2.1.8 3.2" />
                </svg>
                Back to Globe
              </button>

              {/* Selected property overlay */}
              <div className="absolute bottom-4 left-4 z-[500] w-[min(90%,320px)]">
                <AnimatePresence mode="wait">
                  {selectedProperty && phase === "map" && (
                    <SelectedOverlay
                      key={selectedProperty.id}
                      property={selectedProperty}
                      onClose={() => setSelectedId(null)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Map legend */}
              <div
                className="pointer-events-none absolute bottom-4 right-4 z-[500] hidden lg:flex flex-col gap-1.5 rounded-xl px-3 py-2.5"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(15,23,42,0.08)",
                }}
              >
                {Object.entries(SECTOR_STYLE).map(([name, s]) => (
                  <div key={name} className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ background: s.marker }}
                    />
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: "rgba(15,23,42,0.6)" }}
                    >
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Phase label tag */}
            <div
              className="pointer-events-none absolute right-3 top-3 z-[600] rounded-xl px-3 py-1.5"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(156,199,43,0.2)",
                boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
              }}
            >
              <span
                className="text-[9px] font-bold uppercase tracking-[0.2em]"
                style={{ color: BRAND }}
              >
                {phase === "globe" ? "3D Globe" : "Asset Map"}
              </span>
            </div>
          </div>

          {/* RIGHT: property list */}
          <div
            className="flex flex-col lg:w-[420px] xl:w-[460px] rounded-3xl overflow-hidden"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 8px 32px rgba(15,23,42,0.07)",
            }}
          >
            {/* Card list */}
            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
              {filtered.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "rgba(15,23,42,0.38)" }}
                  >
                    No properties match.
                  </p>
                </div>
              ) : (
                <motion.div className="flex flex-col gap-2">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((p, i) => (
                      <motion.div
                        key={p.id}
                        ref={(el) => {
                          if (el) cardRefs.current[p.id] = el;
                        }}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{
                          duration: 0.2,
                          delay: i < 12 ? i * 0.025 : 0,
                        }}
                      >
                        <PropertyCard
                          property={p}
                          active={p.id === selectedId}
                          onClick={() => handleCardClick(p.id)}
                          onHover={() => setHoveredId(p.id)}
                          onLeave={() => setHoveredId(null)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 p-3">
          <div
            className="h-full rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 8px 32px rgba(15,23,42,0.07)",
            }}
          >
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
              {filtered.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "rgba(15,23,42,0.38)" }}
                  >
                    No properties match.
                  </p>
                </div>
              ) : (
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{
                          duration: 0.2,
                          delay: i < 15 ? i * 0.018 : 0,
                        }}
                      >
                        <PropertyListCard
                          property={p}
                          onClick={() => setModalPropertyId(p.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {modalProperty && viewMode === "list" && (
          <PropertyDetailModal
            property={modalProperty}
            onClose={() => setModalPropertyId(null)}
            onViewMap={() => openPropertyInInteractiveMap(modalProperty.id)}
            onViewInteractive={() =>
              openPropertyInInteractiveMap(modalProperty.id)
            }
          />
        )}
      </AnimatePresence>

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
    </motion.div>
  );
}
