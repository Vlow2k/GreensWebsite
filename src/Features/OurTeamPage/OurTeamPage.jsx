import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

const BRAND = "#9cc72b";

const FOOTER_STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const FOOTER_ITEM = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const TEAM_MEMBERS = [
  {
    id: 1,
    section: "Corporate",
    name: "Rajesh J. Kadakia, M.D.",
    role: "Founding Principal",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2020/06/Rajesh-Kadakia-e1592165351391.jpg",
    bio: "Leads corporate strategy, investor relationships, finance, and long-range development initiatives.",
  },
  {
    id: 2,
    section: "Corporate",
    name: "Neil R. Kadakia",
    role: "Managing Principal",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2020/06/Neil-Kadakia-e1592165304725.jpg",
    bio: "Oversees operations, acquisitions, capital planning, and business development across the platform.",
  },
  {
    id: 3,
    section: "Corporate",
    name: "Darshana Kadakia, M.D.",
    role: "Principal",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2020/06/Darshana-Kadakia.jpg",
    bio: "Supports financial stewardship, tax strategy, and financial statement review.",
  },
  {
    id: 4,
    section: "Corporate",
    name: "Sahil Desai",
    role: "Vice President",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2020/06/Sahil-Desai.jpg",
    bio: "Directs property management, maintenance, new development, and construction delivery.",
  },
  {
    id: 5,
    section: "Corporate",
    name: "Charmi Desai",
    role: "Controller",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2020/06/Charmi-Desai.jpg",
    bio: "Leads corporate office administration and core back-office operations.",
  },
  {
    id: 6,
    section: "Corporate",
    name: "Ryan Javaheri",
    role: "Project Manager",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2020/06/IMG_1747-500x500.jpeg",
    bio: "Coordinates field execution with contractors and internal teams for on-time project delivery.",
  },
  {
    id: 7,
    section: "Corporate",
    name: "Vinod Bhole",
    role: "Bookkeeping Manager",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2020/06/Vinod-Bhole-GG-ver1Sm-scaled-e1600878098782-500x500.jpg",
    bio: "Manages reporting, AP/AR workflows, and enterprise document control.",
  },
  {
    id: 8,
    section: "Corporate",
    name: "Bhavik Mistry",
    role: "Architect",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2021/09/Bhavik-Mistry-Headshot-For-Website-e1632441553563-500x500.png",
    bio: "Guides architectural design, plan refinement, and technical review for development projects.",
  },
  {
    id: 9,
    section: "Corporate",
    name: "Jeegar Bhakta",
    role: "Real Estate Analyst",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2022/01/Jeegar-e1642712784376-500x500.jpg",
    bio: "Supports underwriting and investment analysis for prospective opportunities.",
  },
  {
    id: 10,
    section: "Corporate",
    name: "Craig Connelly",
    role: "Construction Manager",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2024/02/Craig-Connelly-Website-Photo.jpg",
    bio: "Oversees construction planning and execution across active projects.",
  },
  {
    id: 11,
    section: "Corporate",
    name: "Sai Malladi",
    role: "IT Administrator",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2025/02/sm-500x500.jpg",
    bio: "Maintains infrastructure and IT operations across Greens Global locations.",
  },
  {
    id: 12,
    section: "Corporate",
    name: "Satish Mandale",
    role: "Business Intelligence Developer",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2025/02/image-500x500.jpg",
    bio: "Builds reporting systems and data workflows for decision support.",
  },
  {
    id: 13,
    section: "Corporate",
    name: "Kartik Jain",
    role: "Web Developer",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2025/02/images-300x300-1.jpeg",
    bio: "Develops and maintains digital experiences and internal web tools.",
  },
  {
    id: 14,
    section: "Corporate",
    name: "Roger Scherer",
    role: "Development Manager",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2025/02/Head-Shot-8.1-500x500.jpg",
    bio: "Interfaces with municipalities and authorities on development approvals and planning.",
  },
  {
    id: 15,
    section: "Corporate",
    name: "Priyanka Sahu",
    role: "Bookkeeping Associate",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-25-at-19.13.48-500x500.jpeg",
    bio: "Supports bookkeeping and day-to-day finance operations.",
  },
  {
    id: 16,
    section: "Corporate",
    name: "Viral Patel",
    role: "Accountant",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2025/02/images-300x300-1.jpeg",
    bio: "Handles tax filings, planning, and accounting functions in the U.S. and India.",
  },
  {
    id: 17,
    section: "Storage",
    name: "Valinda Cranfill",
    role: "Area Manager",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2020/06/Valinda-Cranfill-1-1.jpg",
    bio: "Leads storage operations and team execution across facilities.",
  },
  {
    id: 18,
    section: "Storage",
    name: "Josh Warner",
    role: "Assistant Site Manager",
    image:
      "https://www.greensglobal.com/wp-content/plugins/awsm-team-pro/images/default-user.png",
    bio: "Supports daily operations and customer service at Greens Storage, Escondido.",
  },
  {
    id: 19,
    section: "Storage",
    name: "Miranda Negrete",
    role: "Technical Manager",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2020/07/Miranda-2-e1708468298407-500x500.jpg",
    bio: "Runs day-to-day operations for Greens Storage, Temecula.",
  },
  {
    id: 20,
    section: "Storage",
    name: "Ashley Vizcarra",
    role: "Site Manager",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2024/02/Ashley-500x500.jpg",
    bio: "Oversees operations and customer service at Greens Storage, Temecula.",
  },
  {
    id: 21,
    section: "Storage",
    name: "Amy Bolanos",
    role: "Assistant Area Manager",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2024/05/Amy-e1714611984897-500x500.jpg",
    bio: "Supports operations and customer experience at Greens Storage, Escondido.",
  },
  {
    id: 22,
    section: "Storage",
    name: "Vicki Hale",
    role: "Site Manager",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2024/05/Vicki-Hale-ver2-e1716595320284-500x500.jpeg",
    bio: "Helps lead daily operations at Greens Storage, Valley Center.",
  },
  {
    id: 23,
    section: "Storage",
    name: "Beth Takehana",
    role: "Assistant Site Manager",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2026/01/Beth-500x500.jpeg",
    bio: "Supports site operations, service, and team coordination.",
  },
  {
    id: 24,
    section: "Advisory",
    name: "Thomas J. O'Keefe",
    role: "General Counsel",
    image:
      "https://www.greensglobal.com/wp-content/uploads/2019/11/images.jpeg",
    bio: "Brings decades of tax and corporate law expertise to strategic legal oversight.",
  },
  {
    id: 25,
    section: "Advisory",
    name: "Archana Kadakia, MBA, CPA",
    role: "Consultant & Tax Accountant",
    image:
      "https://www.greensglobal.com/wp-content/plugins/awsm-team-pro/images/default-user.png",
    bio: "Provides financial consulting, tax planning, and underwriting support.",
  },
];

function TeamCard({ member, onClick, index }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index < 12 ? index * 0.03 : 0 }}
      whileHover={{ y: -8, scale: 1.015 }}
      whileTap={{ scale: 0.992 }}
      className="group relative overflow-hidden rounded-2xl text-left"
      style={{
        background: "#fff",
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
      }}
    >
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #edf2f7 0%, #dbe4ef 100%)",
        }}
      >
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-contain object-top p-3 transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[-30%] w-[26%]"
          initial={{ x: "-160%", opacity: 0 }}
          whileHover={{ x: "560%", opacity: [0, 0.35, 0] }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>

      <div className="px-4 py-3.5">
        <h3 className="text-[16px] font-bold leading-tight text-slate-900">
          {member.name}
        </h3>
        <p
          className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: BRAND }}
        >
          {member.role}
        </p>
      </div>
    </motion.button>
  );
}

function TeamModal({ member, onClose }) {
  if (!member) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[900] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl overflow-hidden rounded-3xl"
        style={{
          background: "#fff",
          boxShadow: "0 28px 80px rgba(15,23,42,0.26)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div
            className="h-[340px] md:h-auto"
            style={{
              background: "linear-gradient(180deg, #edf2f7 0%, #dbe4ef 100%)",
            }}
          >
            <img
              src={member.image}
              alt={member.name}
              className="h-full w-full object-contain object-top p-2"
            />
          </div>
          <div className="p-6 md:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{
                    background: "rgba(156,199,43,0.18)",
                    color: "#466314",
                  }}
                >
                  {member.section}
                </span>
                <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900">
                  {member.name}
                </h2>
                <p
                  className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: BRAND }}
                >
                  {member.role}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg"
                style={{
                  background: "rgba(15,23,42,0.08)",
                  color: "rgba(15,23,42,0.6)",
                }}
              >
                ×
              </button>
            </div>

            <p
              className="mt-4 text-[14px] leading-relaxed"
              style={{ color: "rgba(15,23,42,0.68)" }}
            >
              {member.bio}
            </p>

            <div
              className="mt-5 rounded-2xl p-4"
              style={{ background: "rgba(15,23,42,0.04)" }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "rgba(15,23,42,0.45)" }}
              >
                Team Page
              </p>
              <a
                href="https://www.greensglobal.com/about/team/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-semibold"
                style={{ color: BRAND }}
              >
                View source profile directory →
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function OurTeamPage() {
  const [activeId, setActiveId] = useState(null);

  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 600], [0, -140]);
  const activeMember = TEAM_MEMBERS.find((m) => m.id === activeId) ?? null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#f1f5ee" }}
    >
      {/* Parallax background blob */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed right-0 top-1/3 h-[520px] w-[520px] rounded-full"
        style={{
          y: blobY,
          background: "radial-gradient(circle, #9cc72b 0%, transparent 68%)",
          filter: "blur(72px)",
          opacity: 0.13,
        }}
      />

      <header
        className="relative overflow-hidden lg:sticky lg:top-16 lg:z-20"
        style={{
          background:
            "linear-gradient(135deg, #f8faf5 0%, #edf5e5 60%, #f4f9f0 100%)",
          borderBottom: "1px solid rgba(156,199,43,0.18)",
        }}
      >
        <div className="mx-auto max-w-screen-xl px-5 py-6 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span
                  className="h-px w-5 shrink-0"
                  style={{ background: BRAND }}
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.28em]"
                  style={{ color: BRAND }}
                >
                  GG · Team
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 lg:text-4xl">
                Our Team
              </h1>
              <p
                className="mt-1.5 max-w-xl text-sm leading-relaxed"
                style={{ color: "rgba(15,23,42,0.56)" }}
              >
                Behind every project are exceptional people. Meet the
                leadership, operations, and advisory professionals driving
                Greens Global.
              </p>
            </div>
            <div
              className="grid w-full grid-cols-2 gap-y-3 rounded-2xl px-3 py-3 sm:w-auto sm:grid-cols-4 sm:gap-y-0"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(15,23,42,0.09)",
                boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
              }}
            >
              {[
                { label: "Total", value: TEAM_MEMBERS.length },
                {
                  label: "Corporate",
                  value: TEAM_MEMBERS.filter((m) => m.section === "Corporate")
                    .length,
                },
                {
                  label: "Storage",
                  value: TEAM_MEMBERS.filter((m) => m.section === "Storage")
                    .length,
                },
                {
                  label: "Advisory",
                  value: TEAM_MEMBERS.filter((m) => m.section === "Advisory")
                    .length,
                },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="flex flex-1 items-center justify-center"
                >
                  {i > 0 && (
                    <div
                      className="mx-2 h-8 w-px shrink-0"
                      style={{ background: "rgba(15,23,42,0.1)" }}
                    />
                  )}
                  <div className="text-center">
                    <p className="text-3xl font-bold leading-none text-slate-900">
                      {item.value}
                    </p>
                    <p
                      className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: "rgba(15,23,42,0.42)" }}
                    >
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="relative px-3 pb-3 pt-10 lg:px-4 lg:pb-4 lg:pt-12">
        <div className="mx-auto max-w-screen-2xl px-5 py-8 lg:px-10">
          {["Corporate", "Storage", "Advisory"].map((section, sectionIdx) => {
            const sectionMembers = TEAM_MEMBERS.filter(
              (m) => m.section === section
            );
            return (
              <motion.div
                key={section}
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIdx * 0.15 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <motion.div
                  className="mb-8 flex items-center gap-4 pb-4 border-b-2"
                  style={{ borderColor: `${BRAND}33` }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: sectionIdx * 0.15 + 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: sectionIdx * 0.15 + 0.15,
                      ease: "easeOut",
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                    style={{ originX: 0 }}
                  >
                    <span
                      className="h-1.5 w-8 rounded-full"
                      style={{ background: BRAND }}
                    />
                    <span
                      className="h-1 w-1.5 rounded-full"
                      style={{ background: BRAND, opacity: 0.6 }}
                    />
                  </motion.div>
                  <motion.h2
                    className="text-lg font-black uppercase tracking-[0.28em] text-slate-900"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: sectionIdx * 0.15 + 0.2,
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    {section}
                  </motion.h2>
                </motion.div>
                <motion.div
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: sectionIdx * 0.15 + 0.25,
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {sectionMembers.map((member, i) => (
                    <TeamCard
                      key={member.id}
                      member={member}
                      index={i}
                      onClick={() => setActiveId(member.id)}
                    />
                  ))}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeMember && (
          <TeamModal member={activeMember} onClose={() => setActiveId(null)} />
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
