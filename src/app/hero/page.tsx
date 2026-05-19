"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { NavBar, NAV_BAR_HEIGHT_PX } from "@/components/layout/NavBar";

ChartJS.register(ArcElement, Tooltip, Legend);

const projects = [
  {
    title: "Detecting Anomalous Prescriber Billing Patterns",
    description:
      "An end-to-end data engineering pipeline that loads real Medicare Part D claims data into Snowflake, transforms it with dbt across three layers, and applies Isolation Forest machine learning to surface the top 0.5% of statistically suspicious prescribers across 20,935 providers nationwide.",
    gif: "/images/projects/cms-anomaly.gif",
    mp4: "/images/projects/cms-anomaly.mp4",
    poster: "/images/projects/cms-anomaly-poster.jpg",
    github: "https://github.com/Nupur-Gudigar/cms-anomaly-pipeline",
    live: "https://nupur-gudigar.github.io/cms-anomaly-pipeline/",
    domain: "Healthcare Analytics",
    techStack: ["Snowflake", "dbt", "Apache Airflow", "Python", "Isolation Forest", "Great Expectations"],
    tags: [
      "https://img.shields.io/badge/Snowflake-29B5E8?style=flat-square&logo=snowflake&logoColor=white",
      "https://img.shields.io/badge/dbt-FF694B?style=flat-square&logo=dbt&logoColor=white",
      "https://img.shields.io/badge/Apache%20Airflow-017CEE?style=flat-square&logo=apacheairflow&logoColor=white",
      "https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white",
      "https://img.shields.io/badge/Isolation%20Forest-533AB7?style=flat-square",
      "https://img.shields.io/badge/Great%20Expectations-FF694B?style=flat-square",
      "https://img.shields.io/badge/CMS%20Medicare-185FA5?style=flat-square",
      "https://img.shields.io/badge/Anomaly%20Detection-993C1D?style=flat-square",
    ],
  },
  {
    title: "Olympic Figure Skating Data Analysis (2006–2026)",
    description:
      "This end-to-end analysis of Olympic figure skating (2006–2026) quantifies the balance between technical and artistic performance using a custom 'tech dominance' metric. I built the dataset from scratch and used Python and interactive visuals to reveal how scoring trends have evolved over time.",
    gif: "/images/projects/new-skating.gif",
    mp4: "/images/projects/new-skating.mp4",
    poster: "/images/projects/new-skating-poster.jpg",
    github: "https://github.com/Nupur-Gudigar/olympic-skating-analysis",
    live: "https://nupur-gudigar.github.io/olympic-skating-analysis/",
    domain: "Sports Analytics",
    techStack: ["Python", "Pandas", "Plotly", "Jupyter", "EDA", "Custom Metrics", "Dataset Creation"],
    tags: [
      "https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white",
      "https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white",
      "https://img.shields.io/badge/Plotly-3F4F75?style=flat-square&logo=plotly&logoColor=white",
      "https://img.shields.io/badge/Jupyter-F37626?style=flat-square&logo=jupyter&logoColor=white",
      "https://img.shields.io/badge/Data%20Visualization-0F6E56?style=flat-square",
      "https://img.shields.io/badge/Data%20Analysis-185FA5?style=flat-square",
      "https://img.shields.io/badge/EDA-533AB7?style=flat-square",
      "https://img.shields.io/badge/Sports%20Analytics-993C1D?style=flat-square",
      "https://img.shields.io/badge/Dataset%20Creation-444441?style=flat-square",
      "https://img.shields.io/badge/Statistical%20Analysis-BA7517?style=flat-square",
      "https://img.shields.io/badge/Data%20Storytelling-993556?style=flat-square",
      "https://img.shields.io/badge/Custom%20Metrics%20Design-3C3489?style=flat-square",
    ],
  },
  {
    achievement: { label: "🏆 Codedex × GitHub Education Winner", color: "#BA7517" },
    title: "SpinTember - The Ultimate Adventure Wheel!",
    description:
      "A cross-platform desktop application built with React, Vite, and Electron that generates randomized activity suggestions through an interactive spinning wheel. Features state management with Redux, webcam integration, and dynamic UI/UX elements. Fun Fact: This was recognized as a winner in the Codedex x GitHub Education September Coding Challenge.",
    gif: "/images/projects/spintember.gif",
    mp4: "/images/projects/spintember.mp4",
    poster: "/images/projects/spintember-poster.jpg",
    github: "https://github.com/Nupur-Gudigar/Spintember",
    live: "https://nupur-gudigar.github.io/Spintember/",
    domain: "Creative Dev",
    techStack: ["React", "Electron", "Vite", "Redux Toolkit", "JavaScript", "Node.js"],
    tags: [
      "https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB",
      "https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white",
      "https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white",
      "https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white",
      "https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=333",
      "https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white",
      "https://img.shields.io/badge/Camera%20API-444441?style=flat-square",
      "https://img.shields.io/badge/Cross--Platform-0F6E56?style=flat-square",
    ],
  },
  {
    achievement: { label: "★ Codedex Staff Pick · Newsletter Feature", color: "#185FA5" },
    title: "Heart Screen",
    description:
      "A full-screen generative art sketch built with p5.js, featuring layered, animated hearts in shifting shades of pink and red. Designed as a minimal, immersive visual experience with continuous motion and responsive scaling. Fun Fact: this project was featured as a Staff Pick and highlighted in the Codedex newsletter.",
    gif: "/images/projects/hear-screen.gif",
    mp4: "/images/projects/hear-screen.mp4",
    poster: "/images/projects/hear-screen-poster.jpg",
    github: "https://github.com/Nupur-Gudigar/Heart-Screen",
    live: "https://nupur-gudigar.github.io/Heart-Screen/",
    domain: "Creative Coding",
    techStack: ["p5.js", "JavaScript", "Generative Art", "HTML5", "CSS3"],
    tags: [
      "https://img.shields.io/badge/p5.js-ED225D?style=flat-square&logo=p5dotjs&logoColor=white",
      "https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=333",
      "https://img.shields.io/badge/Creative%20Coding-533AB7?style=flat-square",
      "https://img.shields.io/badge/Generative%20Art-3F4F75?style=flat-square",
      "https://img.shields.io/badge/Interactive%20Animation-185FA5?style=flat-square",
      "https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white",
      "https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white",
    ],
  },
  {
    title: "Kirby Music Visualizer",
    description:
      "A lightweight audio visualizer built with p5.js and JavaScript, leveraging FFT-based spectrum analysis and beat detection to generate real-time, interactive visuals. Features responsive design, drag-and-drop audio input, and dynamic animations synced to music.",
    gif: "/images/projects/kirby.gif",
    mp4: "/images/projects/kirby.mp4",
    poster: "/images/projects/kirby-poster.jpg",
    github: "https://github.com/Nupur-Gudigar/Kirby_Visualizer",
    live: "https://nupur-gudigar.github.io/Kirby_Visualizer/",
    domain: "Audio / Creative",
    techStack: ["p5.js", "p5.sound", "JavaScript", "FFT", "Audio Visualization"],
    tags: [
      "https://img.shields.io/badge/p5.js-ED225D?style=flat-square&logo=p5dotjs&logoColor=white",
      "https://img.shields.io/badge/p5.sound-B5154B?style=flat-square",
      "https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=333",
      "https://img.shields.io/badge/Audio%20Visualization-BA7517?style=flat-square",
      "https://img.shields.io/badge/FFT-3B6D11?style=flat-square",
      "https://img.shields.io/badge/Interactive%20Animation-185FA5?style=flat-square",
      "https://img.shields.io/badge/Music%20Tech-444441?style=flat-square",
    ],
  },
  {
    title: "Visualizing YouTube Data with Plotly",
    description:
      "An exploratory data analysis project visualizing YouTube channel data through interactive Plotly charts. The project examines subscriber distributions, content categories, and channel growth patterns to highlight key trends in platform popularity.",
    gif: "/images/projects/youtube-stats.gif",
    mp4: "/images/projects/youtube-stats.mp4",
    poster: "/images/projects/youtube-stats-poster.jpg",
    github: "https://github.com/Nupur-Gudigar/youtube-analysis",
    live: "https://colab.research.google.com/github/Nupur-Gudigar/youtube-analysis/blob/main/Visualize_Youtube_Data_with_Plotly.ipynb",
    domain: "Data Analytics",
    techStack: ["Python", "Pandas", "Plotly", "Jupyter", "EDA"],
    tags: [
      "https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white",
      "https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white",
      "https://img.shields.io/badge/Plotly-3F4F75?style=flat-square&logo=plotly&logoColor=white",
      "https://img.shields.io/badge/Jupyter-F37626?style=flat-square&logo=jupyter&logoColor=white",
      "https://img.shields.io/badge/Data%20Visualization-0F6E56?style=flat-square",
      "https://img.shields.io/badge/EDA-533AB7?style=flat-square",
    ],
  },
];

const MOTION_DURATION = 0.6;
const STICKER_SIDEBAR_WIDTH = 84;
const SIDEBAR_STICKERS = [
  "/images/Rectangle 164.svg",
  "/images/Rectangle 155.svg",
  "/images/Rectangle 154.svg",
  "/images/Rectangle 157.svg",
  "/images/Rectangle 158.svg",
  "/images/Rectangle 159.svg",
  "/images/Rectangle 160.svg",
  "/images/Rectangle 161.svg",
  "/images/Rectangle 162.svg",
  "/images/Rectangle 163.svg",
  "/images/Rectangle 151.svg",
  "/images/Rectangle 153.svg",
] as const;
const SIDEBAR_REPEAT_COUNT = 18;
const SIDEBAR_ROTATION = [-8, 5, -4, 7, -6, 4, -5, 8, -7, 3, -6, 6] as const;
const SIDEBAR_WIDTH = [62, 64, 60, 66, 63, 68, 62, 65, 60, 66, 63, 67] as const;
const SIDEBAR_X_SHIFT = [-3, 2, -1, 3, -2, 2, -1, 3, -3, 1, -2, 2] as const;
const SIDEBAR_GAP = [8, 10, 6, 12, 8, 10, 7, 11, 7, 10, 8, 12] as const;

type DroppedSticker = {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
};

type GhostData = {
  visible: boolean;
  src: string;
  x: number;
  y: number;
  size: number;
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION_DURATION },
};

const fadeFromTop = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION_DURATION },
};

/** Stickers / drag overlays are desktop-only (sidebar is `lg:flex`). */
function useMatchesMinWidth(minWidthPx: number) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width:${minWidthPx}px)`);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [minWidthPx]);
  return matches;
}

function useContainerScale(designWidth: number = 1440) {
  const ref = useRef<HTMLDivElement>(null);
  const [containerScale, setContainerScale] = useState(1);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const availableWidth = entry.contentRect.width;
        const adjustedWidth =
          window.innerWidth >= 1024
            ? Math.max(0, availableWidth - STICKER_SIDEBAR_WIDTH)
            : availableWidth;
        setContainerScale(Math.min(1, adjustedWidth / designWidth));
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [designWidth]);

  return { ref, containerScale };
}

const aboutTechStack = ["Python", "SQL", "dbt", "Tableau", "Spark", "Snowflake", "Figma"] as const;


const dataScienceConsultantDescriptionFirstParagraph =
  "As a Data Science Consultant during my summer internship, I worked on an e-learning platform exploring how data can drive user engagement and product decisions.";

const dataScienceConsultantDescriptionSecondParagraph =
  "From building predictive models to designing data workflows and dashboards, my work focused on turning raw data into insights that actually meant something. This was the first time I realized data storytelling was the part I loved most.";

const infosysDescriptionFirstParagraph =
  "My time at Infosys was a journey of growth, from handling system operations to becoming a client facing Technology Analyst working on cloud based data systems for enterprise clients.";

const infosysDescriptionSecondParagraph =
  "I built automation solutions, analyzed production data to improve reliability and efficiency, and collaborated with stakeholders across teams. My team won the Best Team Award for Project Excellence, which was a genuine highlight, good work recognized by the right people.";

const cpsDescription =
  "At Chicago Public Schools, I managed and analyzed assessment data for over 5,000 student records across multiple school sites. I developed data validation workflows, performed trend and variance analysis, and improved data accuracy by identifying gaps in existing processes. The kind of work that isn't glamorous but matters enormously when the data is about kids' education.";

const beyondResumeCities: Array<{
  name: string;
  coords: [number, number];
  isCurrent?: boolean;
}> = [
    { name: "Chicago, IL", coords: [-87.6298, 41.8781], isCurrent: true },
    { name: "Dallas, TX", coords: [-96.797, 32.7767] },
    { name: "Los Angeles, CA", coords: [-118.2437, 34.0522] },
    { name: "San Francisco, CA", coords: [-122.4194, 37.7749] },
    { name: "Aubrey, TX", coords: [-96.9864, 33.3043] },
    { name: "Miami, FL", coords: [-80.1918, 25.7617] },
    { name: "New Jersey, NJ", coords: [-74.1724, 40.7357] },
    { name: "New York, NY", coords: [-74.006, 40.7128] },
  ];

const beyondResumeTimeSplit = [
  { label: "Sleeping", value: 30, color: "#E8635A" },
  { label: "Music", value: 20, color: "#1DB954" },
  { label: "Actually coding", value: 15, color: "#1c1c1e" },
  { label: "Fixing bugs I created", value: 20, color: "#5865F2" },
  { label: "Convincing myself it's a feature", value: 5, color: "#EF9F27" },
  { label: "Gaming", value: 10, color: "#4B1528" },
] as const;

/** Touch / coarse pointers: tap to flip extras photos (desktop keeps hover). */
function toggleExtrasFlipOnTouch(e: React.MouseEvent<HTMLDivElement>) {
  if (typeof window === "undefined") return;
  if (!window.matchMedia("(hover: none)").matches) return;
  const el = e.currentTarget;
  const flipped = el.style.transform.includes("180");
  el.style.transform = flipped ? "rotateX(0deg)" : "rotateX(180deg)";
}

function BeyondResumeSection() {
  const [statesGeo, setStatesGeo] = useState<Array<{ id: string; d: string }>>([]);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredPin, setHoveredPin] = useState<{ name: string; x: number; y: number } | null>(null);
  const [activeSlice, setActiveSlice] = useState<number | null>(null);
  const width = 420;
  const height = 210;

  const projection = useMemo(
    () => geoAlbersUsa().scale(width * 0.86).translate([width / 2, height / 2 + 10]),
    [width, height],
  );
  const pathGenerator = useMemo(() => geoPath(projection), [projection]);

  useEffect(() => {
    let mounted = true;
    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((r) => r.json())
      .then((usAtlas: any) => {
        if (!mounted) return;
        const statesFeature = feature(usAtlas, usAtlas.objects.states) as any;
        const rawStates: Array<{ id?: string }> = Array.isArray(statesFeature.features) ? statesFeature.features : [];
        const paths = rawStates
          .map((s) => { const d = pathGenerator(s as never); if (!d) return null; return { id: String(s.id), d }; })
          .filter((s): s is { id: string; d: string } => s !== null);
        setStatesGeo(paths);
      })
      .catch(() => setStatesGeo([]));
    return () => { mounted = false; };
  }, [pathGenerator]);

  const chartData = useMemo<ChartData<"doughnut">>(
    () => ({
      labels: beyondResumeTimeSplit.map((i) => i.label),
      datasets: [{
        data: beyondResumeTimeSplit.map((i) => i.value),
        backgroundColor: beyondResumeTimeSplit.map((i) => i.color),
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        offset: beyondResumeTimeSplit.map((_, idx) => activeSlice === idx ? 8 : 0),
      }],
    }),
    [activeSlice],
  );

  const chartOptions = useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      cutout: "56%",
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` } } },
      animation: { duration: 220 },
    }),
    [],
  );

  const panelStyle: React.CSSProperties = { background: "#2a1510", borderRadius: 8, padding: 18 };
  const panelLbl: React.CSSProperties = {
    fontSize: 10, color: "rgba(255,255,255,.38)", letterSpacing: ".13em",
    fontFamily: "monospace", background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.1)", borderRadius: 3,
    padding: "3px 10px", display: "inline-block", marginBottom: 14,
    textTransform: "uppercase",
  };
  const insightStyle: React.CSSProperties = {
    borderLeft: "2px solid rgba(196,114,100,.45)", background: "rgba(255,255,255,.04)",
    padding: "7px 12px", fontSize: 13, color: "rgba(255,255,255,.65)",
    fontStyle: "italic", lineHeight: 1.6,
  };

  const kpis = [
    { label: "COUNTRIES INHABITED", value: "4",    sub: "3 continents before 25",               color: "#c47264", sm: false },
    { label: "US CITIES VISITED",   value: "8+",   sub: "data collection ongoing",              color: "#3d8a6a", sm: false },
    { label: "OVERFITTING RISK",    value: "LOW",  sub: "generalises well beyond training data", color: "#3d8a6a", sm: true  },
    { label: "BUG FIX RATE",        value: "133%", sub: "bugs fixed ÷ actually coding",         color: "#d4a800", sm: false },
  ];

  const insights = [
    "survived an earthquake and a tsunami before 25. disaster recovery score: excellent.",
    "NACE-level competitive gaming as team secretary of illinois tech esports. yes, it's on the resume. yes, it counts.",
    "builds notion dashboards for everything including birthday freebies. the data analyst was not a career choice. it was a diagnosis.",
  ];

  return (
    <section
      id="beyond-resume"
      className="relative w-full scroll-mt-28 bg-[#db5e5e] px-4 py-16 md:px-16"
      aria-label="Beyond the resume"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Heading */}
        <div className="mb-8 text-center">
          <span style={pillStyle}>beyond the resume</span>
          <p style={secSubStyle}>some data about the human behind the data</p>
        </div>

        {/* DB Header */}
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span style={{ display: "inline-block", background: "#3d1010", color: "#e8c8c8", fontFamily: "var(--font-playfair),'Playfair Display',serif", fontStyle: "italic", fontSize: 16, fontWeight: 700, padding: "6px 18px", borderRadius: 5 }}>
            nupur.db
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.28)", fontFamily: "monospace" }}>
            source: nupur&apos;s life · refreshed: daily · n is always growing
          </span>
        </div>

        {/* KPI Row */}
        <div className="mb-[14px] grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map(({ label, value, sub, color, sm }) => (
            <div key={label} style={{ background: "#2a1510", borderRadius: 8, padding: "14px 16px", borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", letterSpacing: ".1em", fontFamily: "monospace", marginBottom: 6, textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontSize: sm ? 22 : 36, fontWeight: 900, color: "#fff", fontFamily: "monospace", lineHeight: 1, paddingTop: sm ? 5 : 0 }}>{value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.38)", fontStyle: "italic", marginTop: 4, lineHeight: 1.4 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* DB Grid */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[3fr_2fr]">
          {/* Map panel */}
          <div style={panelStyle}>
            <span style={panelLbl}>PLACES I&apos;VE BEEN</span>
            <div className="relative">
              <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="US map with city pins" preserveAspectRatio="xMidYMid meet">
                {statesGeo.map((s) => (
                  <path key={s.id} d={s.d} fill="#3d1a0e" stroke="rgba(196,114,100,0.45)" strokeWidth={0.7} />
                ))}
                {beyondResumeCities.map((city) => {
                  const point = projection(city.coords);
                  if (!point) return null;
                  const isActive = hoveredCity === city.name;
                  return (
                    <g key={city.name} className="cursor-pointer"
                      onMouseEnter={() => { setHoveredCity(city.name); setHoveredPin({ name: city.name, x: point[0], y: point[1] }); }}
                      onMouseLeave={() => { setHoveredCity(null); setHoveredPin(null); }}
                    >
                      <circle cx={point[0]} cy={point[1]} r={isActive ? 8 : 6} fill={city.isCurrent ? "#c47264" : "#3d8a6a"} opacity={0.9} />
                      <circle cx={point[0]} cy={point[1]} r={11} fill="transparent" />
                      {city.isCurrent && (
                        <text x={point[0]} y={point[1] + 14} fontSize={10} fill="rgba(255,255,255,0.85)" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Chicago</text>
                      )}
                    </g>
                  );
                })}
              </svg>
              {hoveredPin && (
                <div className="pointer-events-none absolute z-10 rounded px-2 py-1 font-mono text-[11px] text-white shadow"
                  style={{ background: "#3d1010", border: "1px solid rgba(196,114,100,0.4)", left: `${(hoveredPin.x / width) * 100}%`, top: `${(hoveredPin.y / height) * 100}%`, transform: "translate(-50%, calc(-100% - 6px))" }}>
                  {hoveredPin.name}
                </div>
              )}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.25)", marginTop: 8, fontFamily: "monospace" }}>
              ⬟ home base · ● visited · n = {beyondResumeCities.length} · still counting
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Time allocation */}
            <div style={panelStyle}>
              <span style={panelLbl}>TIME ALLOCATION</span>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 130, height: 130, flexShrink: 0 }}>
                  <Doughnut data={chartData} options={chartOptions} aria-label="Doughnut chart showing time split" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {beyondResumeTimeSplit.map((item, idx) => (
                    <button key={item.label} type="button" className="flex w-full items-center gap-[6px] text-left" style={{ marginBottom: 7, background: "none", border: "none", padding: 0, cursor: "default" }}
                      onMouseEnter={() => setActiveSlice(idx)} onMouseLeave={() => setActiveSlice(null)}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, backgroundColor: item.color, display: "inline-block" }} />
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,.65)", flex: 1 }}>{item.label}</span>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,.38)" }}>{item.value}%</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Analyst notes */}
            <div style={panelStyle}>
              <span style={panelLbl}>ANALYST NOTES</span>
              {insights.map((text, i) => (
                <div key={i} style={{ ...insightStyle, marginBottom: i < insights.length - 1 ? 6 : 0 }}>{text}</div>
              ))}
            </div>
          </div>
        </div>

        {/* DB Footer */}
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.22)", textAlign: "center", marginTop: 10, fontFamily: "monospace" }}>
          data quality: mostly reliable · outliers: intentional · confidence interval: 95%
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  const [failedMp4, setFailedMp4] = useState(false);
  const shouldUseVideo = Boolean(project.mp4) && !failedMp4;
  const fallbackMedia = project.poster ?? project.gif;

  return (
    <div className="relative" style={{ overflow: "visible" }}>
      {project.achievement && (
        <div style={{ position: "absolute", top: -11, right: 10, zIndex: 10 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 9px", borderRadius: 12,
            fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
            background: project.achievement.color, color: "#fff",
          }}>
            {project.achievement.label}
          </span>
        </div>
      )}
    <div
      className="group flex flex-col overflow-hidden rounded-[14px] shadow-[2px_4px_18px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-[5px] hover:shadow-[4px_10px_28px_rgba(0,0,0,0.5)]"
      style={{ background: "#0E0808" }}
    >
      {/* Preview */}
      <div
        className="relative flex w-full shrink-0 items-center justify-center overflow-hidden"
        style={{ height: 176 }}
      >
        {shouldUseVideo ? (
          <video
            src={project.mp4}
            poster={project.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onError={() => setFailedMp4(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : fallbackMedia ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fallbackMedia}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#1A1010] text-[48px] opacity-35">
            ðŸ“Š
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-[18px]">
        <span
          className="mb-2 inline-block self-start rounded-[4px] px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.04em]"
          style={{
            background: "rgba(201,151,62,0.15)",
            color: "#C9973E",
            border: "1px solid rgba(201,151,62,0.3)",
          }}
        >
          {project.domain}
        </span>

        <div
          className="mb-2 text-[17px] font-bold leading-[1.3]"
          style={{ color: "#F5EEEE" }}
        >
          {project.title}
        </div>

        <div
          className="mb-3 flex-1 text-[13px] leading-[1.6]"
          style={{ color: "rgba(245,238,238,0.6)" }}
        >
          {project.description}
        </div>

        <div className="mb-[14px] flex flex-wrap gap-[5px]">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-[4px] px-[7px] py-[3px] font-mono text-[10px]"
              style={{
                background: "rgba(245,238,238,0.06)",
                color: "rgba(245,238,238,0.55)",
                border: "1px solid rgba(245,238,238,0.12)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[5px] rounded-[7px] px-[14px] py-[7px] font-mono text-[11px] tracking-[0.03em] no-underline transition-opacity duration-200 hover:opacity-85"
            style={{
              border: "1.5px solid #C9973E",
              background: "#C9973E",
              color: "#0A0606",
            }}
          >
            ⌥ GitHub
          </a>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[5px] rounded-[7px] px-[14px] py-[7px] font-mono text-[11px] tracking-[0.03em] no-underline transition-[background,color,border-color] duration-200 hover:bg-[#C9973E] hover:text-[#0A0606] hover:[border-color:#C9973E]"
            style={{
              border: "1.5px solid rgba(245,238,238,0.45)",
              background: "transparent",
              color: "#F5EEEE",
            }}
          >
            ↗ Live Site
          </a>
        </div>
      </div>
    </div>
    </div>
  );
}

const pillStyle: React.CSSProperties = {
  display: "inline-block",
  background: "#3d1010",
  color: "#e8c8c8",
  fontFamily: "var(--font-playfair),'Playfair Display',serif",
  fontStyle: "italic",
  fontSize: 22,
  fontWeight: 700,
  padding: "11px 32px",
  borderRadius: 8,
};

const pillFunStyle: React.CSSProperties = {
  ...pillStyle,
  background: "#1a2a3a",
  color: "#b0c8e8",
  fontSize: 22,
  padding: "11px 32px",
};

const secSubStyle: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(255,255,255,0.4)",
  letterSpacing: "0.14em",
  fontFamily: "monospace",
  marginTop: 8,
  marginBottom: 0,
  textTransform: "uppercase",
};

const analyticsProjects = [projects[0]!, projects[1]!, projects[5]!];
const funProjects = [projects[2]!, projects[3]!, projects[4]!];

function ProjectGrid() {
  return (
    <div className="mx-auto mt-4 w-full max-w-[1200px] px-3 pb-16 sm:px-5 sm:pb-20 md:px-8 lg:px-[60px] lg:pb-8">
      {/* Data & Analytics */}
      <div className="mb-6 text-center">
        <span style={pillStyle}>data &amp; analytics projects</span>
        <p style={secSubStyle}>the work i&apos;d bring to an interview</p>
      </div>
      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2">
        {analyticsProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

      {/* Divider */}
      <hr style={{ border: "none", borderTop: "1.5px dashed rgba(255,255,255,0.2)", margin: "36px 0" }} />

      {/* Built for Fun */}
      <div className="mb-6 text-center">
        <span style={pillFunStyle}>built for fun</span>
        <p style={secSubStyle}>things i made because i wanted to — also, i win things sometimes</p>
      </div>
      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2">
        {funProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}

const DroppedStickersLayer = memo(function DroppedStickersLayer({
  droppedStickers,
  onRemoveSticker,
}: {
  droppedStickers: DroppedSticker[];
  onRemoveSticker: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none absolute left-0 top-0 z-[220] min-h-full w-full">
      {droppedStickers.map((sticker) => (
        <div
          key={sticker.id}
          data-dropped-sticker-id={sticker.id}
          role="button"
          tabIndex={0}
          onContextMenu={(event) => {
            event.preventDefault();
            onRemoveSticker(sticker.id);
          }}
          className="pointer-events-auto absolute cursor-grab active:cursor-grabbing select-none"
          style={{
            left: sticker.x,
            top: sticker.y,
            width: sticker.size,
            transform: `rotate(${sticker.rotation}deg)`,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))",
          }}
        >
          <img src={encodeURI(sticker.src)} alt="" draggable={false} className="h-auto w-full" />
        </div>
      ))}
    </div>
  );
});

const SidebarStickerRail = memo(function SidebarStickerRail({
  repeatedSidebarStickers,
  startSidebarDrag,
}: {
  repeatedSidebarStickers: string[];
  startSidebarDrag: (event: React.PointerEvent, src: string, index: number) => void;
}) {
  return (
    <aside
      className="absolute left-0 top-0 z-[240] hidden w-[84px] flex-col items-center overflow-hidden border-r border-white/10 bg-white/12 lg:flex"
      style={{ top: 0, bottom: 0 }}
    >
      <p
        className="fixed left-0 w-[84px] shrink-0 px-3 text-center text-[12px] font-extrabold uppercase leading-none tracking-[0.1em] text-[#f2d9d6]/90 border-r border-white/10 bg-[rgba(26,6,6,0.92)]"
        style={{ height: NAV_BAR_HEIGHT_PX, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, zIndex: 241 }}
      >
        STICKERS
      </p>
      <div className="flex w-full flex-col items-center pb-24" style={{ paddingTop: NAV_BAR_HEIGHT_PX }}>
        {repeatedSidebarStickers.map((src, index) => {
          const variant = index % SIDEBAR_STICKERS.length;
          return (
            <button
              key={`${src}-${index}`}
              type="button"
              onPointerDown={(event) => startSidebarDrag(event, src, index)}
              className="group cursor-grab border-0 bg-transparent p-0 active:cursor-grabbing"
              style={{
                marginTop: SIDEBAR_GAP[variant],
                transform: `translateX(${SIDEBAR_X_SHIFT[variant]}px) rotate(${SIDEBAR_ROTATION[variant]}deg)`,
                transition: "transform 180ms ease",
              }}
              aria-label="Drag sticker onto page"
            >
              <img
                src={encodeURI(src)}
                alt=""
                draggable={false}
                className="select-none object-contain transition-transform duration-200 ease-out group-hover:scale-110"
                style={{
                  width: SIDEBAR_WIDTH[variant],
                  height: "auto",
                  filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.24))",
                }}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
});

export default function HeroPage() {
  const desktopStickers = useMatchesMinWidth(1024);
  const [scale, setScale] = useState(1);
  const [droppedStickers, setDroppedStickers] = useState<DroppedSticker[]>([]);
  const [ghostVisible, setGhostVisible] = useState(false);
  const [showStickerHint, setShowStickerHint] = useState<boolean>(true);
  const [viewCount, setViewCount] = useState<number | "loading">("loading");

  useEffect(() => {
    const SESSION_VIEW_KEY = "portfolio-view-counted-session";

    const parse = (data: unknown) =>
      data !== null && typeof data === "object" && "count" in data
        ? Number((data as { count: unknown }).count)
        : Number.NaN;

    const alreadyCountedThisTab = () => {
      try {
        return window.sessionStorage.getItem(SESSION_VIEW_KEY) === "1";
      } catch {
        return false;
      }
    };

    const markCountedThisTab = () => {
      try {
        window.sessionStorage.setItem(SESSION_VIEW_KEY, "1");
      } catch {
        // private mode / blocked storage — still show count via GET
      }
    };

    const run = async () => {
      if (!alreadyCountedThisTab()) {
        try {
          const res = await fetch("/api/views", {
            method: "POST",
            cache: "no-store",
          });
          if (res.ok) {
            const data: unknown = await res.json();
            const n = parse(data);
            if (!Number.isNaN(n)) {
              markCountedThisTab();
              setViewCount(n);
              return;
            }
          }
        } catch {
          // network or non-JSON error body — try GET
        }
      }
      try {
        const res = await fetch("/api/views", { cache: "no-store" });
        if (res.ok) {
          const data: unknown = await res.json();
          const n = parse(data);
          if (!Number.isNaN(n)) {
            setViewCount(n);
            return;
          }
        }
      } catch {
        // ignore
      }
      setViewCount(0);
    };

    void run();
  }, []);

  const ghostRef = useRef<HTMLDivElement>(null);
  const ghostDataRef = useRef<GhostData>({ visible: false, src: "", x: 0, y: 0, size: 56 });
  const stickerIdRef = useRef(1);
  const dragStartedFromSidebarRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const dragMoveRafRef = useRef<number | null>(null);
  const pendingDragPosRef = useRef<{ x: number; y: number } | null>(null);
  const glowActive = true;
  const repeatedSidebarStickers = useMemo(() => {
    const list: string[] = [];
    for (let i = 0; i < SIDEBAR_REPEAT_COUNT; i += 1) list.push(...SIDEBAR_STICKERS);
    return list;
  }, []);
  const { ref: contactContainerRef } = useContainerScale();

  useEffect(() => {
    const updateScale = () => {
      setScale(window.innerWidth >= 1024 ? 0.8 : 1);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const clampFromSidebarIndex = useCallback((index: number) => {
    const variant = index % SIDEBAR_STICKERS.length;
    return {
      size: SIDEBAR_WIDTH[variant],
      rotation: SIDEBAR_ROTATION[variant],
    };
  }, []);
  const clampStickerX = useCallback((x: number) => Math.max(STICKER_SIDEBAR_WIDTH, x), []);
  const setGhostPosition = useCallback((x: number, y: number) => {
    const node = ghostRef.current;
    if (!node) return;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
  }, []);
  const removeSticker = useCallback((id: number) => {
    setDroppedStickers((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const startSidebarDrag = useCallback(
    (event: React.PointerEvent, src: string, index: number) => {
      if (event.button !== 0) return;
      event.preventDefault();
      setShowStickerHint(false);
      const { size } = clampFromSidebarIndex(index);
      dragStartedFromSidebarRef.current = true;
      const nextGhost: GhostData = {
        visible: true,
        src,
        size,
        x: event.clientX - size / 2,
        y: event.clientY - size / 2,
      };
      ghostDataRef.current = nextGhost;
      setGhostVisible(true);
      setGhostPosition(nextGhost.x, nextGhost.y);
    },
    [clampFromSidebarIndex, setGhostPosition],
  );

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const ghost = ghostDataRef.current;
      if (!dragStartedFromSidebarRef.current && !ghost.visible) return;
      if (!ghost.visible) return;
      ghost.x = event.clientX - ghost.size / 2;
      ghost.y = event.clientY - ghost.size / 2;
      setGhostPosition(ghost.x, ghost.y);
    };

    const onUp = (event: PointerEvent) => {
      const ghost = ghostDataRef.current;
      if (ghost.visible) {
        if (event.clientX > STICKER_SIDEBAR_WIDTH) {
          const newId = stickerIdRef.current;
          stickerIdRef.current += 1;
          const size = ghost.size;
          const nextX = clampStickerX(event.clientX + window.scrollX - size / 2);
          setDroppedStickers((prev) => [
            ...prev,
            {
              id: newId,
              src: ghost.src,
              x: nextX,
              y: event.clientY + window.scrollY - size / 2,
              rotation: Math.round((Math.random() * 16 - 8) * 10) / 10,
              size,
            },
          ]);
        }
        ghost.visible = false;
        setGhostVisible(false);
      }
      dragStartedFromSidebarRef.current = false;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [clampStickerX, setGhostPosition]);

  useEffect(() => {
    let draggingId: number | null = null;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const stickerNode = target.closest("[data-dropped-sticker-id]");
      if (!stickerNode) return;
      const idText = stickerNode.getAttribute("data-dropped-sticker-id");
      if (!idText) return;
      const id = Number(idText);
      if (!Number.isFinite(id)) return;
      draggingId = id;
      const rect = stickerNode.getBoundingClientRect();
      dragOffsetRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (draggingId === null) return;
      pendingDragPosRef.current = {
        x: clampStickerX(event.clientX + window.scrollX - dragOffsetRef.current.x),
        y: event.clientY + window.scrollY - dragOffsetRef.current.y,
      };
      if (dragMoveRafRef.current !== null) return;
      dragMoveRafRef.current = window.requestAnimationFrame(() => {
        const next = pendingDragPosRef.current;
        if (draggingId !== null && next) {
          setDroppedStickers((prev) =>
            prev.map((sticker) =>
              sticker.id === draggingId
                ? {
                  ...sticker,
                  x: next.x,
                  y: next.y,
                }
                : sticker,
            ),
          );
        }
        dragMoveRafRef.current = null;
      });
    };

    const onPointerUp = () => {
      draggingId = null;
      pendingDragPosRef.current = null;
      if (dragMoveRafRef.current !== null) {
        window.cancelAnimationFrame(dragMoveRafRef.current);
        dragMoveRafRef.current = null;
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      if (dragMoveRafRef.current !== null) {
        window.cancelAnimationFrame(dragMoveRafRef.current);
        dragMoveRafRef.current = null;
      }
    };
  }, [clampStickerX]);

  return (
    <div className="relative min-h-screen w-full select-none bg-[#db5e5e] overflow-y-visible overflow-x-hidden lg:overflow-x-visible">
      {desktopStickers ? (
        <DroppedStickersLayer droppedStickers={droppedStickers} onRemoveSticker={removeSticker} />
      ) : null}

      <SidebarStickerRail
        repeatedSidebarStickers={repeatedSidebarStickers}
        startSidebarDrag={startSidebarDrag}
      />
      <AnimatePresence>
        {showStickerHint ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="pointer-events-auto fixed left-[92px] top-[80px] z-[250] hidden w-[190px] rounded-[12px] bg-[#400909] px-3 pb-2 pt-2 text-white shadow-[0_6px_18px_rgba(0,0,0,0.28)] lg:block"
            style={{
              fontFamily: "var(--font-nunito), Nunito Sans, system-ui, sans-serif",
            }}
          >
            <button
              type="button"
              aria-label="Dismiss sticker instructions"
              onClick={() => setShowStickerHint(false)}
              className="absolute right-2 top-1 text-[14px] font-extrabold leading-none text-white/85 transition hover:text-white"
            >
              ×
            </button>
            <p className="pr-4 text-[12.5px] font-extrabold italic leading-[1.35]">
              Drag stickers onto the page!
            </p>
            <p className="mt-0.5 text-[12.5px] font-extrabold italic leading-[1.35]">
              Right-click to remove
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {desktopStickers && ghostVisible ? (
        <div
          ref={ghostRef}
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: ghostDataRef.current.x,
            top: ghostDataRef.current.y,
            width: ghostDataRef.current.size,
            transform: "rotate(-4deg) scale(1.12)",
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.35))",
          }}
        >
          <img
            src={encodeURI(ghostDataRef.current.src)}
            alt=""
            draggable={false}
            className="h-auto w-full"
          />
        </div>
      ) : null}

      <NavBar />

      <div
        className={`relative z-[5] w-full min-w-0 pl-4 pr-4 md:pr-8 ${scale < 1 ? "max-w-none" : "max-w-[100dvw]"}`}
        style={
          {
            paddingTop: NAV_BAR_HEIGHT_PX,
            ...(scale < 1
              ? ({
                zoom: scale,
                width: `${100 / scale}%`,
                marginLeft: `${-((100 / scale - 100) / 2)}%`,
              } as React.CSSProperties)
              : {}),
          } as React.CSSProperties
        }
      >
        <div className="relative mx-auto max-w-[1440px]">
          <section id="about" className="scroll-mt-20" aria-label="About">
            {/* Desktop layout */}
            <div className="relative hidden lg:block" style={{ padding: "48px 64px 48px", maxWidth: 1200, margin: "0 auto" }}>
              <img
                src={encodeURI("/images/Star 1.svg")}
                alt=""
                width={380}
                height={380}
                className="pointer-events-none absolute z-0 opacity-40"
                style={{ left: 0, top: -20 }}
              />
              <motion.div
                className="relative z-10 flex items-start gap-6"
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={fadeUp.transition}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1 style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontSize: 78, fontWeight: 900, lineHeight: 1, marginBottom: 20, color: "#fff" }}>
                    Hey!<br />I&apos;m Nupur!
                  </h1>

                  {/* Cred badge */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 24, padding: "8px 20px", marginBottom: 18 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Data Analytics &amp; Engineering</span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>·</span>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>MS CS · Illinois Tech</span>
                  </div>

                  {/* Bio */}
                  <p style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontSize: 17, color: "rgba(255,255,255,0.88)", lineHeight: 1.75, fontStyle: "italic", marginBottom: 18, maxWidth: 520, display: "block" }}>
                    I turn messy data into decisions people actually act on — with a background spanning software engineering, analytics, and consulting. If the dashboard doesn&apos;t tell a story, I&apos;m already redesigning it.
                  </p>

                  {/* Tool pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
                    {aboutTechStack.map((t) => (
                      <span key={t} style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 14, padding: "5px 15px", fontSize: 13, fontWeight: 600, color: "#fff" }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Scrapbook line */}
                  <p style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontStyle: "italic", fontSize: 16, color: "rgba(255,255,255,0.55)" }}>
                    &ldquo;this portfolio is a scrapbook of what I&apos;ve built, learned, and enjoyed along the way.&rdquo;
                  </p>
                </div>

                {/* Right: polaroid */}
                <motion.div
                  style={{ flexShrink: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    glowActive
                      ? { opacity: 1, y: 0, filter: ["drop-shadow(0 0 8px rgba(255,255,255,0.4))", "drop-shadow(0 0 20px rgba(255,255,255,0.7))", "drop-shadow(0 0 8px rgba(255,255,255,0.4))"] }
                      : { opacity: 1, y: 0, filter: "drop-shadow(0 0 0px rgba(255,255,255,0))" }
                  }
                  transition={
                    glowActive
                      ? { opacity: { duration: 0.6, delay: 0.2 }, y: { duration: 0.6, delay: 0.2 }, filter: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 } }
                      : { duration: 0.15 }
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero/polaroid-frame.png"
                    alt="Photos"
                    className="h-auto w-auto object-contain"
                    style={{ maxHeight: "min(86vh, 560px)" }}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Mobile layout */}
            <div className="relative flex flex-col gap-5 px-5 pb-8 pt-20 lg:hidden">
              <img
                src={encodeURI("/images/Star 1.svg")}
                alt=""
                width={280}
                height={280}
                className="pointer-events-none absolute left-1/2 top-4 z-0 w-[min(78vw,260px)] max-w-[280px] -translate-x-1/2 opacity-40"
              />
              <motion.div
                className="relative z-10 flex flex-col gap-4"
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={fadeUp.transition}
              >
                <h1 style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontSize: "clamp(48px,12vw,72px)", fontWeight: 900, lineHeight: 1, color: "#fff" }}>
                  Hey!<br />I&apos;m Nupur!
                </h1>

                {/* Cred badge */}
                <div style={{ display: "inline-flex", alignItems: "center", flexWrap: "wrap", gap: 8, background: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 24, padding: "8px 18px", alignSelf: "flex-start" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Data Analytics &amp; Engineering</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>·</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>MS CS · Illinois Tech</span>
                </div>

                {/* Bio */}
                <p style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontSize: 16, color: "rgba(255,255,255,0.88)", lineHeight: 1.75, fontStyle: "italic" }}>
                  I turn messy data into decisions people actually act on — with a background spanning software engineering, analytics, and consulting. If the dashboard doesn&apos;t tell a story, I&apos;m already redesigning it.
                </p>

                {/* Tool pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {aboutTechStack.map((t) => (
                    <span key={t} style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 14, padding: "5px 14px", fontSize: 13, fontWeight: 600, color: "#fff" }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Scrapbook line */}
                <p style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontStyle: "italic", fontSize: 15, color: "rgba(255,255,255,0.55)" }}>
                  &ldquo;this portfolio is a scrapbook of what I&apos;ve built, learned, and enjoyed along the way.&rdquo;
                </p>
              </motion.div>

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  glowActive
                    ? { opacity: 1, y: 0, filter: ["drop-shadow(0 0 8px rgba(255,255,255,0.4))", "drop-shadow(0 0 20px rgba(255,255,255,0.7))", "drop-shadow(0 0 8px rgba(255,255,255,0.4))"] }
                    : { opacity: 1, y: 0, filter: "drop-shadow(0 0 0px rgba(255,255,255,0))" }
                }
                transition={
                  glowActive
                    ? { opacity: { duration: 0.6, delay: 0.2 }, y: { duration: 0.6, delay: 0.2 }, filter: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 } }
                    : { duration: 0.15 }
                }
              >
                <Image
                  src="/images/hero/polaroid-frame.png"
                  alt="Photos"
                  width={520}
                  height={760}
                  className="mx-auto h-auto max-h-[min(70vh,540px)] w-full max-w-[min(100%,420px)] object-contain"
                  priority
                />
              </motion.div>
            </div>
          </section>
        </div>

        <div className="relative mx-auto w-full max-w-[1440px] bg-[#db5e5e]">
          <div className="bg-[#db5e5e] px-8 pb-2 pt-6 text-center">
            <p style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontStyle: "italic", fontSize: 14, color: "rgba(255,255,255,0.55)", margin: 0, letterSpacing: "0.02em" }}>
              alright, let&apos;s get into it.
            </p>
          </div>

          <section
            id="personal-projects"
            className="relative mb-0 scroll-mt-28 bg-[#db5e5e] pb-12 pt-3 md:pb-16 lg:pb-10 lg:pt-3"
            aria-label="Personal projects"
          >
            <ProjectGrid />
          </section>

          <div className="relative w-full">
            <section
              id="experience"
              className="relative scroll-mt-28 bg-transparent py-16"
              aria-label="Work experience"
            >
              {/* ── HEADING ── */}
              <div className="px-4 pb-8 text-center">
                <div className="mx-auto w-fit">
                  <h2
                    className="inline-block"
                    style={{
                      fontFamily: "var(--font-playfair),'Playfair Display',serif",
                      fontSize: 28,
                      fontWeight: 700,
                      fontStyle: "italic",
                      color: "#e8c8c8",
                      background: "#3d1010",
                      padding: "9px 28px",
                      borderRadius: 6,
                      display: "inline-block",
                    }}
                  >
                    work experience
                  </h2>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em", fontFamily: "monospace", marginTop: 6, textTransform: "uppercase" }}>
                    where i&apos;ve been, what i&apos;ve built
                  </p>
                </div>
              </div>

              {/* ── TIMELINE ── */}
              <div className="relative mx-auto max-w-[1100px] px-6 pb-16">
                <div
                  aria-hidden
                  className="hidden lg:block"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: "rgba(255,255,255,0.18)",
                    transform: "translateX(-50%)",
                    pointerEvents: "none",
                  }}
                />

                {/* ── HEARTLAND ── */}
                <div style={{ textAlign: "center", position: "relative", zIndex: 2, marginBottom: 36 }}>
                  <span style={{ display: "inline-block", fontFamily: "monospace", fontSize: 13, fontWeight: 700, background: "#3d1010", color: "#e8c8c8", padding: "6px 20px", borderRadius: 20, letterSpacing: "0.11em" }}>
                    AUG 2025 – PRESENT
                  </span>
                </div>

                <div className="mb-14 hidden items-start lg:grid" style={{ gridTemplateColumns: "1fr 56px 1fr", gap: "0 16px" }}>
                  <div style={{ background: "#3d1010", borderRadius: 14, padding: 22, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Senior Consultant</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#c47264", marginBottom: 12 }}>Heartland Community Network</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)", padding: "7px 12px", borderRadius: 6, marginBottom: 12, borderLeft: "2px solid rgba(255,255,255,0.25)" }}>
                      🌍 Clients across finance, healthcare, public safety &amp; small businesses
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 14 }}>
                      Build analytical models, define KPIs, and create dashboards that help people actually make decisions — not just look at numbers. Set up data governance standards, because if the data isn&apos;t reliable, nothing downstream is.
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["SQL", "Power BI", "Python", "KPI Design", "Data Governance", "Stakeholder Mgmt"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(255,255,255,0.42)", border: "2px solid rgba(255,255,255,0.7)", boxShadow: "0 0 0 2px rgba(196,114,100,0.3)", flexShrink: 0 }} />
                  </div>
                  {/* HCN photo mosaic — exact Figma positions (frame 591×778) */}
                  <div style={{ padding: 10, background: "#3d1010", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(0,0,0,0.3)", position: "relative" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "591 / 778", borderRadius: 8, overflow: "hidden", background: "#0f0808" }}>
                    {/* Indiana SBDC logo */}
                    <div style={{ position: "absolute", top: "11.83%", right: "69.04%", bottom: "78.28%", left: "15.91%" }}>
                      <img src="/images/hcn/logo-indiana.png" alt="Indiana SBDC" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    {/* IU logo */}
                    <div style={{ position: "absolute", top: "11.83%", right: "49.92%", bottom: "78.28%", left: "35.03%" }}>
                      <img src="/images/hcn/logo-iu.png" alt="IU" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    {/* Cook Center logo */}
                    <div style={{ position: "absolute", top: "11.7%", right: "30.8%", bottom: "78.41%", left: "54.15%" }}>
                      <img src="/images/hcn/logo-cook.png" alt="Cook Center for Entrepreneurship" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    {/* Right photo — HCN materials */}
                    <div style={{ position: "absolute", top: "26.35%", right: "14.89%", bottom: "50.64%", left: "52.28%" }}>
                      <img src="/images/hcn/photo-materials.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    {/* Left photo — meeting */}
                    <div style={{ position: "absolute", top: "29.31%", right: "51.78%", bottom: "44.86%", left: "13.54%" }}>
                      <img src="/images/hcn/photo-meeting1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    {/* Bottom-right photo — Nupur */}
                    <div style={{ position: "absolute", top: "62.98%", right: "14.89%", bottom: "10.67%", left: "53.13%" }}>
                      <img src="/images/hcn/photo-nupur.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    {/* Bottom-left photo — library (with original Figma clip offset) */}
                    <div style={{ position: "absolute", top: "58.23%", right: "55.33%", bottom: "12.21%", left: "13.87%", overflow: "hidden" }}>
                      <img src="/images/hcn/photo-library.png" alt="" style={{ position: "absolute", width: "100%", height: "140.63%", top: "-10.32%", left: 0, objectFit: "cover" }} />
                    </div>
                    {/* Middle-right photo — office */}
                    <div style={{ position: "absolute", top: "45.5%", right: "22.17%", bottom: "32.65%", left: "50.08%" }}>
                      <img src="/images/hcn/photo-office.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    {/* Footer watermark */}
                    <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: "clamp(7px, 1.4%, 10px)", letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>
                      HEARTLAND COMMUNITY NETWORK
                    </div>
                  </div>
                  </div>
                </div>

                <div className="mb-10 flex flex-col gap-4 lg:hidden">
                  <div style={{ padding: 10, background: "#3d1010", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(0,0,0,0.3)" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "591 / 778", borderRadius: 8, overflow: "hidden", background: "#0f0808" }}>
                      <div style={{ position: "absolute", top: "11.83%", right: "69.04%", bottom: "78.28%", left: "15.91%" }}><img src="/images/hcn/logo-indiana.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "11.83%", right: "49.92%", bottom: "78.28%", left: "35.03%" }}><img src="/images/hcn/logo-iu.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "11.7%", right: "30.8%", bottom: "78.41%", left: "54.15%" }}><img src="/images/hcn/logo-cook.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "26.35%", right: "14.89%", bottom: "50.64%", left: "52.28%" }}><img src="/images/hcn/photo-materials.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "29.31%", right: "51.78%", bottom: "44.86%", left: "13.54%" }}><img src="/images/hcn/photo-meeting1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "62.98%", right: "14.89%", bottom: "10.67%", left: "53.13%" }}><img src="/images/hcn/photo-nupur.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "58.23%", right: "55.33%", bottom: "12.21%", left: "13.87%", overflow: "hidden" }}><img src="/images/hcn/photo-library.png" alt="" style={{ position: "absolute", width: "100%", height: "140.63%", top: "-10.32%", left: 0, objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "45.5%", right: "22.17%", bottom: "32.65%", left: "50.08%" }}><img src="/images/hcn/photo-office.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 8, letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>HEARTLAND COMMUNITY NETWORK</div>
                    </div>
                  </div>
                  <div style={{ background: "#3d1010", borderRadius: 14, padding: 18, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Senior Consultant</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#C9973E", marginBottom: 10 }}>Heartland Community Network</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)", padding: "7px 12px", borderRadius: 6, marginBottom: 10, borderLeft: "2px solid rgba(255,255,255,0.25)" }}>🌍 Clients across finance, healthcare, public safety &amp; small businesses</div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 12 }}>Build analytical models, define KPIs, and create dashboards that help people actually make decisions — not just look at numbers. Set up data governance standards, because if the data isn&apos;t reliable, nothing downstream is.</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["SQL", "Power BI", "Python", "KPI Design", "Data Governance", "Stakeholder Mgmt"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── OCT 2024 ── */}
                <div style={{ textAlign: "center", position: "relative", zIndex: 2, marginBottom: 36, marginTop: 12 }}>
                  <span style={{ display: "inline-block", fontFamily: "monospace", fontSize: 13, fontWeight: 700, background: "#3d1010", color: "#e8c8c8", padding: "6px 20px", borderRadius: 20, letterSpacing: "0.11em" }}>
                    OCT 2024 – MAY 2025
                  </span>
                </div>

                <div className="mb-10 hidden items-start lg:grid" style={{ gridTemplateColumns: "1fr 56px 1fr", gap: "0 16px" }}>
                  {/* CPS photo mosaic — exact Figma positions (frame 619×856) */}
                  <div style={{ padding: 10, background: "#3d1010", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(0,0,0,0.3)", position: "relative" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "619 / 856", borderRadius: 8, overflow: "hidden", background: "#0f0808" }}>
                      <div style={{ position: "absolute", top: "7.76%", right: "15.72%", bottom: "67.98%", left: "15.72%" }}>
                        <img src="/images/cps/photo1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "35.08%", right: "58.08%", bottom: "39.13%", left: "16.01%" }}>
                        <img src="/images/cps/photo2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "69.95%", right: "11.94%", bottom: "9.84%", left: "42.21%" }}>
                        <img src="/images/cps/photo3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "54.86%", right: "34.79%", bottom: "28.31%", left: "42.21%" }}>
                        <img src="/images/cps/photo4.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "63.28%", right: "60.7%", bottom: "12.13%", left: "13.54%" }}>
                        <img src="/images/cps/photo5.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "33.77%", right: "15.72%", bottom: "45.14%", left: "45.27%" }}>
                        <img src="/images/cps/photo6.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: "clamp(7px, 1.4%, 10px)", letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>
                        CHICAGO PUBLIC SCHOOLS
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(255,255,255,0.42)", border: "2px solid rgba(255,255,255,0.7)", boxShadow: "0 0 0 2px rgba(196,114,100,0.3)", flexShrink: 0 }} />
                  </div>
                  <div style={{ background: "#3d1010", borderRadius: 14, padding: 22, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Graduate Student Assistant</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#c47264", marginBottom: 12 }}>Chicago Public Schools — Administrative Testing Staff</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)", padding: "7px 12px", borderRadius: 6, marginBottom: 12, borderLeft: "2px solid rgba(255,255,255,0.25)" }}>
                      📋 5,000+ student records managed across multiple school sites
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 14 }}>
                      {cpsDescription}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["Data Validation", "Excel", "Variance Analysis", "Process Improvement"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-14 hidden items-start lg:grid" style={{ gridTemplateColumns: "1fr 56px 1fr", gap: "0 16px" }}>
                  <div style={{ background: "#3d1010", borderRadius: 14, padding: 22, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Data Science Consultant</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#c47264", marginBottom: 12 }}>The Build Fellowship</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)", padding: "7px 12px", borderRadius: 6, marginBottom: 12, borderLeft: "2px solid rgba(255,255,255,0.25)" }}>
                      💡 First time I realized data storytelling was the part I loved most
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 14 }}>
                      {dataScienceConsultantDescriptionFirstParagraph}{" "}{dataScienceConsultantDescriptionSecondParagraph}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["Predictive Modeling", "Python", "Dashboards", "Data Storytelling"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(255,255,255,0.42)", border: "2px solid rgba(255,255,255,0.7)", boxShadow: "0 0 0 2px rgba(196,114,100,0.3)", flexShrink: 0 }} />
                  </div>
                  {/* Build Fellowship photo mosaic — exact Figma positions (frame 687×915) */}
                  <div style={{ padding: 10, background: "#3d1010", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(0,0,0,0.3)", position: "relative" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "687 / 915", borderRadius: 8, overflow: "hidden", background: "#0f0808" }}>
                      <div style={{ position: "absolute", top: "9.18%", right: "18.2%", bottom: "60.22%", left: "14.12%" }}>
                        <img src="/images/build/photo1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "62.62%", right: "13.25%", bottom: "10.38%", left: "20.23%" }}>
                        <img src="/images/build/photo2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "46.89%", right: "13.25%", bottom: "32.35%", left: "46.14%" }}>
                        <img src="/images/build/photo3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: "clamp(7px, 1.4%, 10px)", letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>
                        THE BUILD FELLOWSHIP
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-10 flex flex-col gap-6 lg:hidden">
                  <div style={{ padding: 10, background: "#3d1010", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(0,0,0,0.3)" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "619 / 856", borderRadius: 8, overflow: "hidden", background: "#0f0808" }}>
                      <div style={{ position: "absolute", top: "7.76%", right: "15.72%", bottom: "67.98%", left: "15.72%" }}><img src="/images/cps/photo1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "35.08%", right: "58.08%", bottom: "39.13%", left: "16.01%" }}><img src="/images/cps/photo2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "69.95%", right: "11.94%", bottom: "9.84%", left: "42.21%" }}><img src="/images/cps/photo3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "54.86%", right: "34.79%", bottom: "28.31%", left: "42.21%" }}><img src="/images/cps/photo4.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "63.28%", right: "60.7%", bottom: "12.13%", left: "13.54%" }}><img src="/images/cps/photo5.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "33.77%", right: "15.72%", bottom: "45.14%", left: "45.27%" }}><img src="/images/cps/photo6.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 8, letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>CHICAGO PUBLIC SCHOOLS</div>
                    </div>
                  </div>
                  <div style={{ background: "#3d1010", borderRadius: 14, padding: 18, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Graduate Student Assistant</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#C9973E", marginBottom: 10 }}>Chicago Public Schools — Administrative Testing Staff</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)", padding: "7px 12px", borderRadius: 6, marginBottom: 10, borderLeft: "2px solid rgba(255,255,255,0.25)" }}>📋 5,000+ student records managed across multiple school sites</div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 12 }}>{cpsDescription}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["Data Validation", "Excel", "Variance Analysis", "Process Improvement"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: 10, background: "#3d1010", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(0,0,0,0.3)" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "687 / 915", borderRadius: 8, overflow: "hidden", background: "#0f0808" }}>
                      <div style={{ position: "absolute", top: "9.18%", right: "18.2%", bottom: "60.22%", left: "14.12%" }}><img src="/images/build/photo1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "62.62%", right: "13.25%", bottom: "10.38%", left: "20.23%" }}><img src="/images/build/photo2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "46.89%", right: "13.25%", bottom: "32.35%", left: "46.14%" }}><img src="/images/build/photo3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 8, letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>THE BUILD FELLOWSHIP</div>
                    </div>
                  </div>
                  <div style={{ background: "#3d1010", borderRadius: 14, padding: 18, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Data Science Consultant</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#C9973E", marginBottom: 10 }}>The Build Fellowship</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)", padding: "7px 12px", borderRadius: 6, marginBottom: 10, borderLeft: "2px solid rgba(255,255,255,0.25)" }}>💡 First time I realized data storytelling was the part I loved most</div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 12 }}>{dataScienceConsultantDescriptionFirstParagraph}{" "}{dataScienceConsultantDescriptionSecondParagraph}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["Predictive Modeling", "Python", "Dashboards", "Data Storytelling"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── INFOSYS ── */}
                <div style={{ textAlign: "center", position: "relative", zIndex: 2, marginBottom: 36, marginTop: 12 }}>
                  <span style={{ display: "inline-block", fontFamily: "monospace", fontSize: 13, fontWeight: 700, background: "#3d1010", color: "#e8c8c8", padding: "6px 20px", borderRadius: 20, letterSpacing: "0.11em" }}>
                    2019 – 2023 · INFOSYS
                  </span>
                </div>

                <div className="hidden items-start lg:grid" style={{ gridTemplateColumns: "1fr 56px 1fr", gap: "0 16px" }}>
                  {/* Infosys photo mosaic — exact Figma positions (frame 661×896) */}
                  <div style={{ padding: 10, background: "#3d1010", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(0,0,0,0.3)", position: "relative" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "661 / 896", borderRadius: 8, overflow: "hidden", background: "#0f0808" }}>
                      <div style={{ position: "absolute", top: "5.46%", right: "12.52%", bottom: "53.88%", left: "10.04%" }}>
                        <img src="/images/infosys/photo1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "38.36%", right: "54.29%", bottom: "29.29%", left: "13.1%" }}>
                        <img src="/images/infosys/photo2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "75.85%", right: "33.19%", bottom: "6.01%", left: "21.11%" }}>
                        <img src="/images/infosys/photo3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "43.28%", right: "11.06%", bottom: "38.14%", left: "51.82%" }}>
                        <img src="/images/infosys/photo4.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "69.29%", right: "66.38%", bottom: "17.6%", left: "7.28%" }}>
                        <img src="/images/infosys/photo5.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "58.8%", right: "8.15%", bottom: "10.6%", left: "55.17%" }}>
                        <img src="/images/infosys/photo6.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", top: "57.16%", right: "48.62%", bottom: "26.99%", left: "30.42%" }}>
                        <img src="/images/infosys/photo7.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: "clamp(7px, 1.4%, 10px)", letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>
                        INFOSYS LIMITED
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(255,255,255,0.42)", border: "2px solid rgba(255,255,255,0.7)", boxShadow: "0 0 0 2px rgba(196,114,100,0.3)", flexShrink: 0 }} />
                  </div>
                  <div style={{ background: "#3d1010", borderRadius: 14, padding: 22, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Technology Analyst</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#c47264", marginBottom: 12 }}>Infosys Limited · Solvay Client · Bangalore</div>
                    {/* Role progression */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                      {[
                        { label: "Systems Engineer", active: false },
                        { label: "Senior Systems Engineer", active: false },
                        { label: "Technology Analyst", active: true },
                      ].map(({ label, active }, i, arr) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontFamily: "monospace", fontSize: 10, padding: "3px 9px", borderRadius: 4, color: active ? "#c47264" : "rgba(255,255,255,0.42)", background: active ? "rgba(196,114,100,0.15)" : "rgba(255,255,255,0.05)", border: active ? "1px solid rgba(196,114,100,0.4)" : "1px solid rgba(255,255,255,0.1)", fontWeight: active ? 700 : 400 }}>{label}</span>
                          {i < arr.length - 1 && <span style={{ color: "rgba(250,240,220,0.25)", fontSize: 10 }}>→</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)", padding: "7px 12px", borderRadius: 6, marginBottom: 12, borderLeft: "2px solid rgba(255,255,255,0.25)" }}>
                      🏆 RISE Award — Best Team, Project Excellence (FY24)
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 14 }}>
                      {infosysDescriptionFirstParagraph}{" "}{infosysDescriptionSecondParagraph}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["AWS", "Cloud Systems", "Automation", "Enterprise Clients", "ITIL V4"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 lg:hidden">
                  <div style={{ padding: 10, background: "#3d1010", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(0,0,0,0.3)" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "661 / 896", borderRadius: 8, overflow: "hidden", background: "#0f0808" }}>
                      <div style={{ position: "absolute", top: "5.46%", right: "12.52%", bottom: "53.88%", left: "10.04%" }}><img src="/images/infosys/photo1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "38.36%", right: "54.29%", bottom: "29.29%", left: "13.1%" }}><img src="/images/infosys/photo2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "75.85%", right: "33.19%", bottom: "6.01%", left: "21.11%" }}><img src="/images/infosys/photo3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "43.28%", right: "11.06%", bottom: "38.14%", left: "51.82%" }}><img src="/images/infosys/photo4.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "69.29%", right: "66.38%", bottom: "17.6%", left: "7.28%" }}><img src="/images/infosys/photo5.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "58.8%", right: "8.15%", bottom: "10.6%", left: "55.17%" }}><img src="/images/infosys/photo6.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "57.16%", right: "48.62%", bottom: "26.99%", left: "30.42%" }}><img src="/images/infosys/photo7.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 8, letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>INFOSYS LIMITED</div>
                    </div>
                  </div>
                  <div style={{ background: "#3d1010", borderRadius: 14, padding: 18, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-playfair),'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Technology Analyst</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#C9973E", marginBottom: 10 }}>Infosys Limited · 2019–2023</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
                      {[
                        { label: "Systems Engineer", active: false },
                        { label: "Senior Systems Engineer", active: false },
                        { label: "Technology Analyst", active: true },
                      ].map(({ label, active }, i, arr) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontFamily: "monospace", fontSize: 9, padding: "2px 7px", borderRadius: 4, color: active ? "#c47264" : "rgba(255,255,255,0.42)", background: active ? "rgba(196,114,100,0.15)" : "rgba(255,255,255,0.05)", border: active ? "1px solid rgba(196,114,100,0.4)" : "1px solid rgba(255,255,255,0.1)", fontWeight: active ? 700 : 400 }}>{label}</span>
                          {i < arr.length - 1 && <span style={{ color: "rgba(250,240,220,0.25)", fontSize: 9 }}>→</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)", padding: "7px 12px", borderRadius: 6, marginBottom: 10, borderLeft: "2px solid rgba(255,255,255,0.25)" }}>🏆 RISE Award — Best Team, Project Excellence (FY24)</div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 12 }}>{infosysDescriptionFirstParagraph}{" "}{infosysDescriptionSecondParagraph}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["AWS", "Cloud Systems", "Automation", "Enterprise Clients", "ITIL V4"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </div>

          <section
            id="certifications-preview"
            className="relative scroll-mt-28 bg-[#db5e5e] px-4 pb-20 pt-10 md:px-8 md:pb-24 lg:pb-28"
            aria-label="Certifications and skills preview"
          >
            <div className="relative mx-auto w-full max-w-[1440px]">
              <div className="relative mx-auto max-w-[1120px]">
                <div className="mb-8 text-center">
                  <span style={pillStyle}>certifications &amp; skills</span>
                  <p style={secSubStyle}>yes, i actually did all of these — the stickers are proof</p>
                </div>

                <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.1fr_0.7fr]">
                  <div className="mt-5 lg:mt-20">
                    <p className="mx-auto mb-2 text-center font-sans text-[14px] font-extrabold italic leading-snug text-white md:text-[22px]">
                      Stickers don&apos;t lie. My laptop is basically my CV.
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 14 }}>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "monospace", letterSpacing: "0.04em" }}>Full list on my resume</span>
                      <a
                        href="/resume/Nupur-Gudigar-Resume.pdf"
                        download="Nupur-Gudigar-Resume.pdf"
                        aria-label="Download resume"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#3d0909", color: "#fff", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textDecoration: "none", border: "1px solid #5b1111", whiteSpace: "nowrap" }}
                      >
                        ↓ Download Resume
                      </a>
                    </div>

                    {/* SVG laptop with interactive hover zones over each sticker */}
                    <div style={{ position: "relative", maxWidth: 829 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={encodeURI("/images/Component 22.svg")}
                        alt="Laptop with skill stickers and technology logos"
                        width={829}
                        height={648}
                        className="h-auto w-full object-contain"
                      />
                      {/* Hover zones — positions as % of SVG 829×648 viewBox */}
                      {([
                        { label: "Python",       left: "11.2%", top: "16.4%", w: "17.4%", h: "12.5%" },
                        { label: "R",            left: "36.3%", top: "17.7%", w: "9.7%",  h: "10.5%" },
                        { label: "Tableau",      left: "53.1%", top: "21.1%", w: "18.7%", h: "13.4%" },
                        { label: "Google Cloud", left: "13.1%", top: "29.0%", w: "20.4%", h: "14.7%" },
                        { label: "Jupyter",      left: "11.8%", top: "61.5%", w: "11.7%", h: "17.4%" },
                        { label: "AWS",          left: "55.6%", top: "46.0%", w: "14.0%", h: "10.1%" },
                        { label: "AWS Cloud",    left: "36.8%", top: "33.4%", w: "16.8%", h: "12.8%" },
                        { label: "GitHub",       left: "24.8%", top: "52.9%", w: "10.3%", h: "7.7%"  },
                        { label: "Sticker",      left: "43.2%", top: "66.5%", w: "10.3%", h: "13.1%" },
                        { label: "CSS",          left: "35.4%", top: "53.2%", w: "10.3%", h: "7.7%"  },
                        { label: "JavaScript",   left: "43.3%", top: "54.2%", w: "9.5%",  h: "9.7%"  },
                        { label: "HTML",         left: "12.2%", top: "43.5%", w: "12.1%", h: "13.0%" },
                        { label: "SQL",          left: "53.0%", top: "12.4%", w: "10.1%", h: "11.1%" },
                        { label: "Power BI",     left: "29.9%", top: "65.0%", w: "9.4%",  h: "13.4%" },
                        { label: "Excel",        left: "72.3%", top: "65.0%", w: "15.0%", h: "13.3%" },
                        { label: "Git",          left: "75.6%", top: "19.3%", w: "10.4%", h: "10.0%" },
                        { label: "Sticker 2",    left: "72.6%", top: "36.1%", w: "13.4%", h: "9.9%"  },
                      ] as const).map(({ label, left, top, w, h }) => (
                        <div
                          key={label}
                          title={label}
                          style={{
                            position: "absolute",
                            left, top, width: w, height: h,
                            borderRadius: 8,
                            cursor: "pointer",
                            transition: "box-shadow 0.2s, transform 0.2s",
                          }}
                          onMouseEnter={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.boxShadow = "0 0 0 2px rgba(255,255,255,0.7), 0 4px 18px rgba(255,255,255,0.35)";
                            el.style.transform = "scale(1.08)";
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.boxShadow = "";
                            el.style.transform = "";
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mx-auto w-full max-w-[340px] lg:-mt-8">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={encodeURI("/images/Component 21.svg")}
                        alt="Hanging name badge listing certifications"
                        width={390}
                        height={840}
                        className="h-auto w-full object-contain"
                      />
                      {/* Cert stamp overlays — coords are % of SVG viewBox 390×840, width extends to cover logo + text */}
                    </div>

                    <p className="mt-4 text-center font-sans text-[28px] font-extrabold italic leading-tight text-white md:text-[36px]">
                      I&apos;M CERTIFIED TOO
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <BeyondResumeSection />

          {/* -- EXTRAS -- */}
          <section
            id="extras"
            className="scroll-mt-28 bg-[#db5e5e] px-4 py-14 md:px-8 lg:px-14"
          >
            <div className="mx-auto w-full max-w-[1200px]">
              <div className="mb-10 text-center">
                <span style={pillStyle}>life outside the terminal</span>
                <p style={secSubStyle}>psst... hover over the photos to flip them</p>
              </div>
              <div
                style={{
                  background: "#1a0f0a",
                  borderRadius: 12,
                  padding: "36px 24px 28px",
                  border: "1px solid rgba(255,255,255,.06)",
                }}
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                  {/* Card 1: Nupur info */}
                  <div style={{ position: "relative", paddingTop: 14 }}>
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 18, height: 18, borderRadius: "50%", background: "#c0392b", zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,.6)" }} />
                    <div style={{ background: "#8b1a1a", borderRadius: 8, padding: "28px 22px 24px", minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(0,0,0,.4)" }}>
                      <p style={{ fontSize: 10, color: "rgba(255,210,200,.5)", fontFamily: "monospace", letterSpacing: ".13em", textTransform: "uppercase", margin: 0 }}>the human</p>
                      <h3 style={{ fontSize: 22, fontWeight: 800, color: "#faf0dc", fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", fontStyle: "italic", margin: 0, textAlign: "center" }}>Nupur Gudigar</h3>
                      <p style={{ fontSize: 13, color: "rgba(255,210,200,.75)", fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", margin: 0, textAlign: "center", lineHeight: 1.5 }}>
                        Data Analyst · Chicago, IL<br />MS Data Science @ IIT
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Gaming Club */}
                  <div style={{ position: "relative", paddingTop: 14 }}>
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 18, height: 18, borderRadius: "50%", background: "#c0392b", zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,.6)" }} />
                    <div style={{ perspective: "1000px" }}>
                      <div style={{ position: "relative", height: 200, transition: "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)", transformStyle: "preserve-3d", cursor: "pointer" }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "rotateX(180deg)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "rotateX(0deg)"; }}
                        onClick={toggleExtrasFlipOnTouch}>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,.4)", background: "#0d0705" }}>
                          <img src={encodeURI("/images/Component 15.svg")} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateX(180deg)", background: "#2a1510", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 18px" }}>
                          <h4 style={{ margin: 0, fontSize: 17, color: "#e8c8c8", fontWeight: 700, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>Gaming Club Secretary</h4>
                          <p style={{ marginTop: 10, fontSize: 13, color: "rgba(232,200,200,.7)", lineHeight: 1.5, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>Leading the gaming community — organizing events, tournaments, and bringing gamers together.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: PAWS Chicago */}
                  <div style={{ position: "relative", paddingTop: 14 }}>
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 18, height: 18, borderRadius: "50%", background: "#c0392b", zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,.6)" }} />
                    <div style={{ perspective: "1000px" }}>
                      <div style={{ position: "relative", height: 200, transition: "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)", transformStyle: "preserve-3d", cursor: "pointer" }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "rotateX(180deg)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "rotateX(0deg)"; }}
                        onClick={toggleExtrasFlipOnTouch}>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,.4)", background: "#0d0705" }}>
                          <img src={encodeURI("/images/Rectangle 68.svg")} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateX(180deg)", background: "#2a1510", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 18px" }}>
                          <h4 style={{ margin: 0, fontSize: 17, color: "#e8c8c8", fontWeight: 700, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>PAWS Chicago Volunteer</h4>
                          <p style={{ marginTop: 10, fontSize: 13, color: "rgba(232,200,200,.7)", lineHeight: 1.5, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>Volunteering at PAWS Chicago, helping rescue animals find their forever homes.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Illinois Esports */}
                  <div style={{ position: "relative", paddingTop: 14 }}>
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 18, height: 18, borderRadius: "50%", background: "#c0392b", zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,.6)" }} />
                    <div style={{ perspective: "1000px" }}>
                      <div style={{ position: "relative", height: 200, transition: "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)", transformStyle: "preserve-3d", cursor: "pointer" }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "rotateX(180deg)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "rotateX(0deg)"; }}
                        onClick={toggleExtrasFlipOnTouch}>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,.4)", background: "#0d0705" }}>
                          <img src={encodeURI("/images/Rectangle 66.svg")} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateX(180deg)", background: "#2a1510", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 18px" }}>
                          <h4 style={{ margin: 0, fontSize: 17, color: "#e8c8c8", fontWeight: 700, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>Illinois Esports</h4>
                          <p style={{ marginTop: 10, fontSize: 13, color: "rgba(232,200,200,.7)", lineHeight: 1.5, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>Competing in the Illinois esports scene — where passion meets strategy.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 5: Furry Friend */}
                  <div style={{ position: "relative", paddingTop: 14 }}>
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 18, height: 18, borderRadius: "50%", background: "#c0392b", zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,.6)" }} />
                    <div style={{ perspective: "1000px" }}>
                      <div style={{ position: "relative", height: 200, transition: "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)", transformStyle: "preserve-3d", cursor: "pointer" }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "rotateX(180deg)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "rotateX(0deg)"; }}
                        onClick={toggleExtrasFlipOnTouch}>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,.4)", background: "#0d0705" }}>
                          <img src={encodeURI("/images/Rectangle 67.svg")} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateX(180deg)", background: "#2a1510", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 18px" }}>
                          <h4 style={{ margin: 0, fontSize: 17, color: "#e8c8c8", fontWeight: 700, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>Furry Friend</h4>
                          <p style={{ marginTop: 10, fontSize: 13, color: "rgba(232,200,200,.7)", lineHeight: 1.5, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>A wholesome encounter with this adorable service dog who brightened everyone&apos;s day.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 6: Google Visit */}
                  <div style={{ position: "relative", paddingTop: 14 }}>
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 18, height: 18, borderRadius: "50%", background: "#c0392b", zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,.6)" }} />
                    <div style={{ perspective: "1000px" }}>
                      <div style={{ position: "relative", height: 200, transition: "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)", transformStyle: "preserve-3d", cursor: "pointer" }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "rotateX(180deg)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "rotateX(0deg)"; }}
                        onClick={toggleExtrasFlipOnTouch}>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,.4)", background: "#0d0705" }}>
                          <img src={encodeURI("/images/Rectangle 65.svg")} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateX(180deg)", background: "#2a1510", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 18px" }}>
                          <h4 style={{ margin: 0, fontSize: 17, color: "#e8c8c8", fontWeight: 700, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>Google Visit</h4>
                          <p style={{ marginTop: 10, fontSize: 13, color: "rgba(232,200,200,.7)", lineHeight: 1.5, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>Exploring Google&apos;s office and getting inspired by the culture of innovation.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 7: Google Chicago */}
                  <div style={{ position: "relative", paddingTop: 14 }}>
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 18, height: 18, borderRadius: "50%", background: "#c0392b", zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,.6)" }} />
                    <div style={{ perspective: "1000px" }}>
                      <div style={{ position: "relative", height: 200, transition: "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)", transformStyle: "preserve-3d", cursor: "pointer" }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "rotateX(180deg)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "rotateX(0deg)"; }}
                        onClick={toggleExtrasFlipOnTouch}>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,.4)", background: "#0d0705" }}>
                          <img src={encodeURI("/images/Rectangle 64.svg")} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateX(180deg)", background: "#2a1510", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 18px" }}>
                          <h4 style={{ margin: 0, fontSize: 17, color: "#e8c8c8", fontWeight: 700, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>Google Chicago</h4>
                          <p style={{ marginTop: 10, fontSize: 13, color: "rgba(232,200,200,.7)", lineHeight: 1.5, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>Visiting Google&apos;s Chicago office — a day full of learning and inspiration.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 8: Team Photo */}
                  <div style={{ position: "relative", paddingTop: 14 }}>
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 18, height: 18, borderRadius: "50%", background: "#c0392b", zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,.6)" }} />
                    <div style={{ perspective: "1000px" }}>
                      <div style={{ position: "relative", height: 200, transition: "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)", transformStyle: "preserve-3d", cursor: "pointer" }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "rotateX(180deg)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "rotateX(0deg)"; }}
                        onClick={toggleExtrasFlipOnTouch}>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,.4)", background: "#0d0705" }}>
                          <img src={encodeURI("/images/Rectangle 63.svg")} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>
                        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateX(180deg)", background: "#2a1510", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 18px" }}>
                          <h4 style={{ margin: 0, fontSize: 17, color: "#e8c8c8", fontWeight: 700, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>Team Photo</h4>
                          <p style={{ marginTop: 10, fontSize: 13, color: "rgba(232,200,200,.7)", lineHeight: 1.5, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", textAlign: "center" }}>A snapshot with amazing peers and mentors who made the journey memorable.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
          {/* -- CONTACT -- */}
          <div id="contact" className="scroll-mt-28" ref={contactContainerRef} style={{ width: "100%", backgroundColor: "#db5e5e", display: "flex", flexDirection: "column" }}>
            {/* Main contact grid */}
            <div className="mx-auto w-full max-w-[1200px] px-6 pt-16 pb-16 md:px-10" style={{ flex: 1 }}>
              <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-[60px]">

                {/* LEFT: phone image + "let's talk" + pick platform */}
                <div className="flex flex-col items-center text-center lg:-mt-20">
                  <img
                    src={encodeURI("/images/Rectangle 151.svg")}
                    alt="Phone"
                    className="self-start lg:self-auto"
                    style={{
                      height: 300,
                      width: "auto",
                      marginBottom: 16,
                      objectFit: "contain",
                    }}
                  />
                  <div
                    className="ml-8 lg:ml-16"
                    style={{
                      fontFamily: "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
                      fontSize: "clamp(28px, 4vw, 42px)",
                      fontWeight: 800,
                      fontStyle: "italic",
                      background: "#400909",
                      color: "#FAF0DC",
                      padding: "10px 28px 12px",
                      borderRadius: 50,
                      display: "inline-block",
                      marginTop: -36,
                      marginBottom: 10,
                      lineHeight: 1.1,
                    }}
                  >
                    let&apos;s talk!!
                  </div>
                  <p
                    className="ml-8 lg:ml-0"
                    style={{
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: "rgba(247,236,236,0.55)",
                      letterSpacing: "0.04em",
                      margin: 0,
                    }}
                  >
                    pick your platform, i don&apos;t bite
                  </p>
                </div>

                {/* RIGHT: seeking statement + contact grid + end pill */}
                <div className="flex flex-col" style={{ paddingTop: 12 }}>
                  {/* Seeking statement */}
                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: 1.75,
                      color: "rgba(247,236,236,0.85)",
                      fontStyle: "italic",
                      marginBottom: 20,
                      padding: "14px 18px",
                      background: "rgba(44,14,14,0.2)",
                      borderRadius: 10,
                      borderLeft: "3px solid #400909",
                    }}
                  >
                    Currently open to{" "}
                    <strong style={{ fontStyle: "normal", color: "#FAF0DC", fontWeight: 600 }}>
                      data engineering and analytics consulting roles across the United States
                    </strong>
                    {" "}especially in healthcare and manufacturing. I build things that make data actually useful to the people who need it. I also actually reply.
                  </div>

                  {/* Contact cards — vertical stack */}
                  <div className="mb-[22px] flex flex-col gap-3">
                    {(
                      [
                        {
                          href: "https://www.linkedin.com/in/nupur-gudigar",
                          newTab: true,
                          bg: "#1a3a5c",
                          icon: "🔗",
                          label: "LINKEDIN",
                          name: "Nupur Gudigar",
                          sub: "Let's build something together.",
                        },
                        {
                          href: "mailto:nupurgudigar.tech@gmail.com",
                          newTab: false,
                          bg: "#2a1510",
                          icon: "✉️",
                          label: "EMAIL",
                          name: "nupurgudigar.tech@gmail.com",
                          sub: "I actually reply.",
                        },
                        {
                          href: "https://github.com/Nupur-Gudigar",
                          newTab: true,
                          bg: "#161b22",
                          icon: "🐱",
                          label: "GITHUB",
                          name: "~/nupurgudigar",
                          sub: "$ git connect --me",
                        },
                      ] as const
                    ).map(({ href, newTab, bg, icon, label, name, sub }) => (
                      <a
                        key={label}
                        href={href}
                        target={newTab ? "_blank" : undefined}
                        rel={newTab ? "noopener noreferrer" : undefined}
                        style={{
                          display: "flex", alignItems: "center", gap: 13,
                          background: bg, borderRadius: 10, padding: "12px 15px",
                          textDecoration: "none",
                          transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(5px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                          {icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 7, color: "rgba(255,255,255,.35)", letterSpacing: ".13em", fontFamily: "monospace", marginBottom: 2, textTransform: "uppercase" }}>{label}</div>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 1, fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,.45)", fontStyle: "italic", fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif" }}>{sub}</div>
                        </div>
                        <span style={{ color: "rgba(255,255,255,.22)", fontSize: 16, flexShrink: 0 }}>→</span>
                      </a>
                    ))}
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Footer — full width at root level */}
      <div
        className="w-full lg:ml-[84px] lg:w-[calc(100%-84px)]"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.12)",
          padding: "20px 40px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2a1510", borderRadius: 22, padding: "7px 18px" }}>
          <span style={{ fontSize: 16 }}>🎮</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.65)", fontFamily: "monospace", letterSpacing: ".06em" }}>Achievement Made!&nbsp;&nbsp;The End?</span>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 10.5,
            fontFamily: "var(--font-playfair),'Playfair Display',serif",
            fontStyle: "italic",
            color: "rgba(255,255,255,.38)",
            textAlign: "center",
          }}
        >
          © 2025 Nupur Gudigar · designed &amp; built with questionable sleep habits
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "rgba(38,35,35,0.84)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            padding: "5px 14px",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.04)",
            boxShadow: "0 2px 14px rgba(0,0,0,0.3)",
            fontFamily: "var(--font-nunito), 'Nunito Sans', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "#E8A4A4",
          }}
        >
          👁{" "}{viewCount === "loading" ? "…" : viewCount.toLocaleString()}{" "}views
        </div>
      </div>
    </div>
  );
}
