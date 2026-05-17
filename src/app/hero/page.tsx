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
const SIDEBAR_WIDTH = [44, 46, 42, 48, 45, 50, 44, 47, 42, 48, 45, 49] as const;
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

const bioParagraphs = [
  "I'm a data analytics and consulting professional with a background in software engineering basically a bit of a Swiss Army knife when it comes to tech. I hold a Master's Degree in Computer Science (Data Analytics) from the Illinois Institute of Technology, Chicago",
  "I've always been more interested in the full picture not just dashboards and models, but how data turns into decisions people actually enjoy acting on. If it doesn't feel right, I'm probably already redesigning it (yes, in Figma, for fun).",
  "Outside of work, I'm a gamer at heart which honestly explains a lot. Good design, smooth systems, intuitive experiences I care about all of it, probably more than I should.",
] as const;


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
  const [statesGeo, setStatesGeo] = useState<Array<{ id: string; d: string }>>(
    [],
  );
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredPin, setHoveredPin] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);
  const [activeSlice, setActiveSlice] = useState<number | null>(null);
  const width = 420;
  const height = 210;

  const projection = useMemo(
    () =>
      geoAlbersUsa()
        .scale(width * 0.86)
        .translate([width / 2, height / 2 + 10]),
    [width, height],
  );

  const pathGenerator = useMemo(() => geoPath(projection), [projection]);

  useEffect(() => {
    let mounted = true;

    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((response) => response.json())
      .then((usAtlas: any) => {
        if (!mounted) return;
        const statesFeature = feature(usAtlas, usAtlas.objects.states) as any;
        const rawStates: Array<{ id?: string }> = Array.isArray(
          statesFeature.features,
        )
          ? statesFeature.features
          : [];
        const paths = rawStates
          .map((state) => {
            const d = pathGenerator(state as never);
            if (!d) return null;
            return { id: String(state.id), d };
          })
          .filter((state): state is { id: string; d: string } => state !== null);
        setStatesGeo(paths);
      })
      .catch(() => {
        setStatesGeo([]);
      });

    return () => {
      mounted = false;
    };
  }, [pathGenerator]);

  const chartData = useMemo<ChartData<"doughnut">>(
    () => ({
      labels: beyondResumeTimeSplit.map((item) => item.label),
      datasets: [
        {
          data: beyondResumeTimeSplit.map((item) => item.value),
          backgroundColor: beyondResumeTimeSplit.map((item) => item.color),
          borderColor: "#FAF0DC",
          borderWidth: 2,
          offset: beyondResumeTimeSplit.map((_, idx) =>
            activeSlice === idx ? 8 : 0,
          ),
        },
      ],
    }),
    [activeSlice],
  );

  const chartOptions = useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "56%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
          },
        },
      },
      animation: { duration: 220 },
    }),
    [],
  );

  const getStarPath = (
    cx: number,
    cy: number,
    outerRadius: number,
    innerRadius: number,
  ) => {
    let d = "";
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      d += `${i === 0 ? "M" : "L"} ${x} ${y} `;
    }
    return `${d}Z`;
  };

  return (
    <section
      id="beyond-resume"
      className="relative w-full max-w-[100%] scroll-mt-28 overflow-x-hidden bg-[#db5e5e] px-4 pb-20 pt-10 md:px-8 md:pb-24"
      aria-label="Beyond the resume"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1240px]">
        <div className="mx-auto w-fit max-w-full text-center lg:mx-0 lg:w-fit lg:-rotate-[0.7deg] lg:text-left">
          <h2
            className="inline-block max-w-full text-balance whitespace-normal lg:whitespace-nowrap"
            style={{
              fontFamily:
                "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
              fontSize: "clamp(1.35rem, 4vw, 2.5rem)",
              fontWeight: 800,
              fontStyle: "italic",
              color: "#FAF0DC",
              lineHeight: 1.1,
              background: "#400909",
              padding: "8px 14px",
              display: "inline-block",
            }}
          >
            beyond the resume
          </h2>
          <div
            style={{
              height: 4,
              background: "#FAF0DC",
              marginTop: 6,
              width: "100%",
            }}
          />
          <p
            className="mt-2 max-w-full break-words px-0 text-center font-mono text-sm leading-snug text-balance sm:text-base md:text-[18px] lg:text-left"
            style={{ color: "#ffffff", opacity: 0.8 }}
          >
            some data about the human behind the data
          </p>
        </div>

        <div className="mt-6 grid min-w-0 grid-cols-1 items-stretch gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex min-w-0 flex-col rounded-[16px] border-[3px] border-[#1a1a1a] bg-[#FAF0DC] p-4 shadow-[4px_4px_0_#1a1a1a] md:p-5">
            <span className="inline-block rounded bg-[#E8635A] px-3 py-1 font-mono text-[13px] font-bold text-[#FAF0DC]">
              places i&apos;ve been
            </span>
            <div className="relative mt-3 overflow-hidden rounded-[10px] bg-[#FAF0DC]">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-auto w-full max-w-full"
                role="img"
                aria-label="Map of the United States with city pins"
                preserveAspectRatio="xMidYMid meet"
              >
                {statesGeo.map((state) => (
                  <path
                    key={state.id}
                    d={state.d}
                    fill="#D4534A"
                    stroke="#FAF0DC"
                    strokeWidth={0.7}
                  />
                ))}
                {beyondResumeCities.map((city) => {
                  const point = projection(city.coords);
                  if (!point) return null;
                  const isActive = hoveredCity === city.name;
                  return (
                    <g
                      key={city.name}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => {
                        setHoveredCity(city.name);
                        setHoveredPin({
                          name: city.name,
                          x: point[0],
                          y: point[1],
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredCity(null);
                        setHoveredPin(null);
                      }}
                    >
                      {city.isCurrent ? (
                        <path
                          d={getStarPath(point[0], point[1], isActive ? 10 : 8, 4.5)}
                          fill={isActive ? "#1a1a1a" : "#FAF0DC"}
                          stroke="#1a1a1a"
                          strokeWidth={1.8}
                        />
                      ) : (
                        <circle
                          cx={point[0]}
                          cy={point[1]}
                          r={isActive ? 8 : 6}
                          fill={isActive ? "#1a1a1a" : "#FAF0DC"}
                          stroke="#1a1a1a"
                          strokeWidth={1.8}
                        />
                      )}
                      <circle cx={point[0]} cy={point[1]} r={11} fill="transparent" />
                    </g>
                  );
                })}
              </svg>
              {hoveredPin ? (
                <div
                  className="pointer-events-none absolute z-10 rounded bg-[#1a1a1a] px-2 py-1 font-mono text-[11px] text-[#FAF0DC] shadow"
                  style={{
                    left: `${(hoveredPin.x / width) * 100}%`,
                    top: `${(hoveredPin.y / height) * 100}%`,
                    transform: "translate(-50%, calc(-100% - 6px))",
                  }}
                >
                  {hoveredPin.name}
                </div>
              ) : null}
            </div>
            <p className="mt-2 font-mono text-[11px] italic text-[#666]">
              {hoveredCity ?? "hover over a pin to see the city"}
            </p>

            <div className="mt-4 flex-1 rounded-[10px] border border-[#1a1a1a]/10 bg-[#f0ead6] p-3">
              <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#999]">
                cities logged
              </p>
              <div className="flex flex-wrap gap-1.5">
                {beyondResumeCities.map((city) => (
                  <span
                    key={city.name}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px]"
                    style={
                      city.isCurrent
                        ? { background: "#1a1a1a", color: "#FAF0DC", fontWeight: 700 }
                        : { border: "1px solid rgba(26,26,26,0.18)", color: "#555" }
                    }
                  >
                    {city.isCurrent && (
                      <span style={{ fontSize: 8 }}>★</span>
                    )}
                    {city.name}
                  </span>
                ))}
              </div>
              <p className="mt-3 font-mono text-[9px] text-[#aaa]">
                n = {beyondResumeCities.length} · data collection ongoing
              </p>
            </div>

            <p className="mt-3 font-mono text-[11px] text-[#666]">
              data gathered from: Nupur&apos;s Life · source: her phone
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <div className="min-w-0 rounded-[16px] border-[3px] border-[#1a1a1a] bg-[#FAF0DC] p-4 shadow-[4px_4px_0_#1a1a1a] md:p-5">
              <span className="inline-block rounded bg-[#E8635A] px-3 py-1 font-mono text-[13px] font-bold text-[#FAF0DC]">
                how i spend my time
              </span>
              <div className="relative mx-auto mt-2 h-[min(220px,55vw)] w-full max-w-full min-w-0 sm:h-[220px]">
                <Doughnut
                  data={chartData}
                  options={chartOptions}
                  aria-label="Doughnut chart showing time split"
                />
              </div>
              <div className="mt-3 grid gap-2">
                {beyondResumeTimeSplit.map((item, idx) => (
                  <button
                    key={item.label}
                    type="button"
                    className="flex items-center gap-2 text-left font-mono text-[12px] text-[#3a3a3a]"
                    onMouseEnter={() => setActiveSlice(idx)}
                    onMouseLeave={() => setActiveSlice(null)}
                    onFocus={() => setActiveSlice(idx)}
                    onBlur={() => setActiveSlice(null)}
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label} - {item.value}%
                  </button>
                ))}
              </div>
            </div>

            <div className="min-w-0 rounded-[16px] border-[3px] border-[#1a1a1a] bg-[#FAF0DC] p-4 shadow-[4px_4px_0_#1a1a1a] md:p-5">
              <span className="inline-block rounded bg-[#E8635A] px-3 py-1 font-mono text-[11px] font-bold text-[#FAF0DC]">
                fun facts
              </span>
              <div className="mt-3 grid gap-2.5">
                <div className="rounded-r-md border-l-[3px] border-[#E8635A] bg-[#f4e8d0] px-3 py-2">
                  <p className="font-mono text-[12px] text-[#3a3a3a]">
                    lived in 4 countries before 25 and survived an earthquake and a tsunami
                    (turns out i have very good disaster recovery)
                  </p>
                </div>
                <div className="rounded-r-md border-l-[3px] border-[#E8635A] bg-[#f4e8d0] px-3 py-2">
                  <p className="font-mono text-[12px] text-[#3a3a3a]">
                    team secretary of Illinois Tech Esports — NACE level competitive gaming
                    (yes, it&apos;s on my resume. yes, i&apos;m serious. yes, it counts.)
                  </p>
                </div>
                <div className="rounded-r-md border-l-[3px] border-[#E8635A] bg-[#f4e8d0] px-3 py-2">
                  <p className="font-mono text-[12px] text-[#3a3a3a]">
                    makes notion dashboards and spreadsheets for everything — including tracking
                    birthday freebies (the data analyst was not a career choice, it was a
                    diagnosis)
                  </p>
                </div>
              </div>
            </div>
          </div>
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
  );
}

function ProjectGrid() {
  return (
    <div className="mx-auto mt-10 w-full max-w-[1200px] px-3 pb-16 sm:px-5 sm:pb-20 md:px-8 lg:px-[60px] lg:pb-8">
      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2">
        {projects.map((project) => (
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
      className="fixed left-0 top-0 z-[240] hidden w-[84px] flex-col items-center overflow-hidden border-r border-white/10 bg-white/12 py-2 lg:flex"
      style={{ top: 0, bottom: 0, overflow: "hidden" }}
    >
      <p className="mb-3 w-full px-3 pt-2 text-center text-[12px] font-extrabold uppercase leading-none tracking-[0.1em] text-[#f2d9d6]/90">
        STICKERS
      </p>
      <div className="flex w-full flex-col items-center pb-24">
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const { ref: extrasContainerRef, containerScale: extrasContainerScale } =
    useContainerScale();
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
      {/* Mobile hamburger — outside zoomed container */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setMobileMenuOpen(true)}
        className="fixed right-4 top-4 z-[9999] flex h-14 w-14 flex-col items-center justify-center gap-[5px] rounded-full bg-[#400909] shadow-[0_0_0_3px_#FAF0DC] lg:hidden"
      >
        <span className="block h-[2.5px] w-5 rounded-full bg-[#FAF0DC]" />
        <span className="block h-[2.5px] w-5 rounded-full bg-[#FAF0DC]" />
        <span className="block h-[2.5px] w-5 rounded-full bg-[#FAF0DC]" />
      </button>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-8 bg-[#400909] lg:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full text-3xl font-bold text-[#FAF0DC]"
            >
              ×
            </button>
            {[
              { id: "about", label: "ABOUT ME" },
              { id: "experience", label: "WORK EXPERIENCE" },
              { id: "personal-projects", label: "PROJECTS" },
              { id: "extras", label: "EXTRAS" },
              { id: "contact", label: "CONTACT" },
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-center text-[28px] font-extrabold italic text-[#FAF0DC] no-underline"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
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
          <motion.div {...fadeFromTop}>
            <NavBar />
          </motion.div>

          <section id="about" className="scroll-mt-28" aria-label="About">
            {/* Desktop-2 artboard: fixed 1440px canvas (scrolls horizontally if needed) */}
            <div className="relative hidden min-h-[780] overflow-x-clip overflow-y-visible lg:block">
              <div className="relative min-h-[780] min-w-[1440px]">
                {/* Subtle hero star backdrop */}
                <img
                  src={encodeURI("/images/Star 1.svg")}
                  alt=""
                  width={440}
                  height={440}
                  className="pointer-events-none absolute z-[0] opacity-40"
                  style={{ left: 220, top: -2 }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element -- Desktop-2 spec: native <img> */}
                <img
                  src="/images/quote-open.svg"
                  alt=""
                  width={106}
                  height={82}
                  className="pointer-events-none absolute z-[1]"
                  style={{ left: 114, top: 30 }}
                />

                <motion.h1
                  className="absolute z-[2] font-sans text-[100px] font-extrabold italic leading-none text-[#1e1e1e]"
                  style={{ left: 220, top: 50, maxWidth: 900 }}
                  initial={fadeUp.initial}
                  animate={fadeUp.animate}
                  transition={fadeUp.transition}
                >
                  <span className="block">Hey!</span>
                  <span className="mt-2 block">I&apos;m Nupur!</span>
                </motion.h1>

                <motion.div
                  className="absolute z-[2] text-center font-sans text-[20px] font-extrabold italic leading-snug text-white"
                  style={{ left: 172, top: 280, width: 665 }}
                  initial={fadeUp.initial}
                  animate={fadeUp.animate}
                  transition={{ ...fadeUp.transition, delay: 0.08 }}
                >
                  {bioParagraphs.map((text, i) => (
                    <p key={i} className={i > 0 ? "mt-6" : ""}>
                      {text}
                    </p>
                  ))}
                </motion.div>

                {/* eslint-disable-next-line @next/next/no-img-element -- Desktop-2 spec: native <img> */}
                <img
                  src="/images/quote-close.svg"
                  alt=""
                  width={98}
                  height={80}
                  className="pointer-events-none absolute z-[1]"
                  style={{ left: 671, top: 630 }}
                />

                <motion.div
                  className="absolute right-0 top-[12px] flex items-start justify-end "
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    glowActive
                      ? {
                        opacity: 1,
                        y: 0,
                        filter: [
                          "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                          "drop-shadow(0 0 20px rgba(255,255,255,0.7))",
                          "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                        ],
                      }
                      : {
                        opacity: 1,
                        y: 0,
                        filter: "drop-shadow(0 0 0px rgba(255,255,255,0))",
                      }
                  }
                  transition={
                    glowActive
                      ? {
                        opacity: { duration: 0.6, delay: 0.2 },
                        y: { duration: 0.6, delay: 0.2 },
                        filter: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2,
                        },
                      }
                      : { duration: 0.15 }
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero/polaroid-frame.png"
                    alt="Photos"
                    className="h-auto max-h-[min(86vh,760px)] w-auto max-w-full object-contain"
                  />
                </motion.div>
              </div>
            </div>

            {/* Smaller viewports: stacked layout */}
            <div className="relative flex flex-col gap-10 px-4 pb-8 pt-20 lg:hidden">
              <img
                src={encodeURI("/images/Star 1.svg")}
                alt=""
                width={280}
                height={280}
                className="pointer-events-none absolute left-1/2 top-4 z-0 w-[min(78vw,260px)] max-w-[280px] -translate-x-1/2 opacity-40"
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- Desktop-2 spec: native <img> */}
              <img
                src="/images/quote-open.svg"
                alt=""
                width={106}
                height={82}
                className="mx-auto w-20 max-w-full sm:w-auto"
              />
              <motion.h1
                className="text-center font-sans text-5xl font-extrabold italic leading-none text-[#1e1e1e] sm:text-6xl md:text-7xl"
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={fadeUp.transition}
              >
                <span className="block">Hey!</span>
                <span className="mt-2 block">I&apos;m Nupur!</span>
              </motion.h1>
              <motion.div
                className="mx-auto w-full max-w-[min(665px,100%)] px-1 text-center font-sans text-base font-extrabold italic leading-snug text-white sm:px-0 sm:text-lg"
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={{ ...fadeUp.transition, delay: 0.08 }}
              >
                {bioParagraphs.map((text, i) => (
                  <p key={i} className={i > 0 ? "mt-5" : ""}>
                    {text}
                  </p>
                ))}
              </motion.div>
              {/* eslint-disable-next-line @next/next/no-img-element -- Desktop-2 spec: native <img> */}
              <img
                src="/images/quote-close.svg"
                alt=""
                width={98}
                height={80}
                className="mx-auto w-20 max-w-full sm:w-auto"
              />
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  glowActive
                    ? {
                      opacity: 1,
                      y: 0,
                      filter: [
                        "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                        "drop-shadow(0 0 20px rgba(255,255,255,0.7))",
                        "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                      ],
                    }
                    : {
                      opacity: 1,
                      y: 0,
                      filter: "drop-shadow(0 0 0px rgba(255,255,255,0))",
                    }
                }
                transition={
                  glowActive
                    ? {
                      opacity: { duration: 0.6, delay: 0.2 },
                      y: { duration: 0.6, delay: 0.2 },
                      filter: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2,
                      },
                    }
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

        <div className="relative mx-auto w-full max-w-[1440px] bg-[#db5e5e] lg:-mt-20">
          {/* Scrapbook intro quote — bridges About Me and Projects */}
          <div className="relative bg-[#db5e5e] py-8 lg:py-0">
            <div className="relative mx-auto hidden max-w-[1440px] overflow-visible lg:block">
              <div className="relative min-h-[420px] min-w-[1440px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/quote-open.svg"
                  alt=""
                  width={106}
                  height={82}
                  className="pointer-events-none absolute z-[1]"
                  style={{ left: 250, top: 31 }}
                />

                <div
                  className="absolute z-[2] text-center font-sans text-white"
                  style={{
                    left: "50%",
                    top: 82,
                    width: 693,
                    transform: "translateX(-50%) rotate(-0.16deg)",
                  }}
                >
                  <p className="text-[20px] font-bold italic leading-snug">
                    {"this portfolio is a bit of a "}
                    <span className="text-[32px] font-black italic">
                      scrapbook
                    </span>
                    {" of what I've built, learned, and enjoyed along the way."}
                  </p>
                  <p className="mt-8 text-[20px] font-extrabold italic leading-snug">
                    {"Please take a look around."}
                  </p>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/quote-close.svg"
                  alt=""
                  width={98}
                  height={80}
                  className="pointer-events-none absolute z-[1]"
                  style={{
                    left: 1091,
                    top: 180,
                    transform: "rotate(180deg) scaleX(-1)",
                  }}
                />

                <p
                  className="absolute z-[2] text-center font-sans text-[32px] font-bold italic leading-snug text-white"
                  style={{
                    left: "50%",
                    top: 312,
                    width: 709,
                    transform: "translateX(-50%)",
                  }}
                >
                  {"alright, let's get into it."}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 px-4 py-10 lg:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/quote-open.svg"
                alt=""
                width={106}
                height={82}
                className="w-20 max-w-full sm:w-auto"
              />
              <div className="mx-auto max-w-[min(693px,100%)] px-1 text-center font-sans text-white">
                <p className="text-base font-bold italic leading-snug sm:text-[20px]">
                  {"this portfolio is a bit of a "}
                  <span className="text-2xl font-black italic sm:text-[32px]">
                    scrapbook
                  </span>
                  {" of what I've built, learned, and enjoyed along the way."}
                </p>
                <p className="mt-8 text-base font-extrabold italic leading-snug sm:text-[20px]">
                  {"Please take a look around."}
                </p>
              </div>
              <p className="max-w-[709px] text-center font-sans text-xl font-bold italic leading-snug text-white sm:text-[32px]">
                {"alright, let's get into it."}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/quote-close.svg"
                alt=""
                width={98}
                height={80}
                className="mt-8 w-20 max-w-full rotate-180 -scale-x-100 sm:mt-12 sm:w-auto"
              />
            </div>
          </div>

          <section
            id="personal-projects"
            className="relative mb-0 scroll-mt-28 bg-[#db5e5e] px-4 pb-12 pt-[40px] md:px-8 md:pb-16 lg:pb-10 lg:pt-[60px]"
            aria-label="Personal projects"
          >
            <div className="relative z-[1] mx-auto w-full min-w-0 max-w-[1440px]">
              <div className="mx-auto w-fit max-w-full text-center lg:-rotate-[0.5deg]">
                <h2
                  className="inline-block max-w-full text-balance whitespace-normal lg:whitespace-nowrap"
                  style={{
                    fontFamily:
                      "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
                    fontSize: "clamp(1.35rem, 4vw, 2.5rem)",
                    fontWeight: 800,
                    fontStyle: "italic",
                    color: "#FAF0DC",
                    lineHeight: 1.1,
                    background: "#400909",
                    padding: "8px 14px",
                    display: "inline-block",
                  }}
                >
                  personal projects
                </h2>
                <div
                  style={{
                    height: 4,
                    background: "#FAF0DC",
                    marginTop: 6,
                    width: "100%",
                  }}
                />
                <p
                  className="mt-2 text-center font-mono text-[18px]"
                  style={{ color: "#ffffff", opacity: 0.8 }}
                >
                  things i built because i wanted to
                </p>
              </div>
            </div>

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
                      fontFamily: "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
                      fontSize: "clamp(1.35rem, 4vw, 2.5rem)",
                      fontWeight: 800,
                      fontStyle: "italic",
                      color: "#FAF0DC",
                      lineHeight: 1.1,
                      background: "#400909",
                      padding: "8px 14px",
                      display: "inline-block",
                    }}
                  >
                    WORK EXPERIENCE
                  </h2>
                  <div style={{ height: 4, background: "#FAF0DC", marginTop: 6, width: "100%" }} />
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
                    background: "rgba(44,14,14,0.35)",
                    transform: "translateX(-50%)",
                    pointerEvents: "none",
                  }}
                />

                {/* ── HEARTLAND ── */}
                <div style={{ textAlign: "center", position: "relative", zIndex: 2, marginBottom: 36 }}>
                  <span style={{ display: "inline-block", fontFamily: "monospace", fontSize: 11, background: "#400909", color: "#FAF0DC", padding: "6px 20px", borderRadius: 20, letterSpacing: "0.06em" }}>
                    AUG 2025 – PRESENT
                  </span>
                </div>

                <div className="mb-14 hidden items-start lg:grid" style={{ gridTemplateColumns: "1fr 56px 1fr", gap: "0 16px" }}>
                  <div style={{ background: "rgba(82,38,12,0.88)", borderRadius: 14, padding: 22, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", fontSize: 19, fontWeight: 700, color: "#FAF0DC", marginBottom: 3 }}>Senior Consultant</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#C9973E", marginBottom: 12 }}>Heartland Community Network</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(201,151,62,0.12)", color: "rgba(250,240,220,0.85)", padding: "7px 12px", borderRadius: 6, marginBottom: 12, borderLeft: "3px solid #C9973E" }}>
                      🌍 Clients across finance, healthcare, public safety &amp; small businesses
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 14 }}>
                      Build analytical models, define KPIs, and create dashboards that help people actually make decisions — not just look at numbers. Set up data governance standards, because if the data isn&apos;t reliable, nothing downstream is.
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["SQL", "Power BI", "Python", "KPI Design", "Data Governance", "Stakeholder Mgmt"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(201,151,62,0.12)", color: "#C9973E", border: "1px solid rgba(201,151,62,0.25)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#C9973E", border: "3px solid #db5e5e", boxShadow: "0 0 0 2px rgba(44,14,14,0.5)", flexShrink: 0 }} />
                  </div>
                  {/* HCN photo mosaic — exact Figma positions (frame 591×778) */}
                  <div style={{ padding: 10, background: "linear-gradient(135deg, #6b2e0e 0%, #3a1508 100%)", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(80,30,20,0.35)", position: "relative" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "591 / 778", borderRadius: 8, overflow: "hidden", background: "#221008" }}>
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
                      <img src="/images/hcn/photo-materials.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    {/* Left photo — meeting */}
                    <div style={{ position: "absolute", top: "29.31%", right: "51.78%", bottom: "44.86%", left: "13.54%" }}>
                      <img src="/images/hcn/photo-meeting1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    {/* Bottom-right photo — Nupur */}
                    <div style={{ position: "absolute", top: "62.98%", right: "14.89%", bottom: "10.67%", left: "53.13%" }}>
                      <img src="/images/hcn/photo-nupur.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    {/* Bottom-left photo — library (with original Figma clip offset) */}
                    <div style={{ position: "absolute", top: "58.23%", right: "55.33%", bottom: "12.21%", left: "13.87%", overflow: "hidden" }}>
                      <img src="/images/hcn/photo-library.png" alt="" style={{ position: "absolute", width: "100%", height: "140.63%", top: "-10.32%", left: 0, objectFit: "cover" }} />
                    </div>
                    {/* Middle-right photo — office */}
                    <div style={{ position: "absolute", top: "45.5%", right: "22.17%", bottom: "32.65%", left: "50.08%" }}>
                      <img src="/images/hcn/photo-office.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    {/* Footer watermark */}
                    <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: "clamp(7px, 1.4%, 10px)", letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>
                      HEARTLAND COMMUNITY NETWORK
                    </div>
                  </div>
                  </div>
                </div>

                <div className="mb-10 flex flex-col gap-4 lg:hidden">
                  <div style={{ padding: 10, background: "linear-gradient(135deg, #6b2e0e 0%, #3a1508 100%)", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(80,30,20,0.35)" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "591 / 778", borderRadius: 8, overflow: "hidden", background: "#221008" }}>
                      <div style={{ position: "absolute", top: "11.83%", right: "69.04%", bottom: "78.28%", left: "15.91%" }}><img src="/images/hcn/logo-indiana.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "11.83%", right: "49.92%", bottom: "78.28%", left: "35.03%" }}><img src="/images/hcn/logo-iu.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "11.7%", right: "30.8%", bottom: "78.41%", left: "54.15%" }}><img src="/images/hcn/logo-cook.png" alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                      <div style={{ position: "absolute", top: "26.35%", right: "14.89%", bottom: "50.64%", left: "52.28%" }}><img src="/images/hcn/photo-materials.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "29.31%", right: "51.78%", bottom: "44.86%", left: "13.54%" }}><img src="/images/hcn/photo-meeting1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "62.98%", right: "14.89%", bottom: "10.67%", left: "53.13%" }}><img src="/images/hcn/photo-nupur.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "58.23%", right: "55.33%", bottom: "12.21%", left: "13.87%", overflow: "hidden" }}><img src="/images/hcn/photo-library.png" alt="" style={{ position: "absolute", width: "100%", height: "140.63%", top: "-10.32%", left: 0, objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "45.5%", right: "22.17%", bottom: "32.65%", left: "50.08%" }}><img src="/images/hcn/photo-office.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 8, letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>HEARTLAND COMMUNITY NETWORK</div>
                    </div>
                  </div>
                  <div style={{ background: "rgba(82,38,12,0.88)", borderRadius: 14, padding: 18, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", fontSize: 17, fontWeight: 700, color: "#FAF0DC", marginBottom: 3 }}>Senior Consultant</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#C9973E", marginBottom: 10 }}>Heartland Community Network</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(201,151,62,0.12)", color: "rgba(250,240,220,0.85)", padding: "7px 12px", borderRadius: 6, marginBottom: 10, borderLeft: "3px solid #C9973E" }}>🌍 Clients across finance, healthcare, public safety &amp; small businesses</div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 12 }}>Build analytical models, define KPIs, and create dashboards that help people actually make decisions — not just look at numbers. Set up data governance standards, because if the data isn&apos;t reliable, nothing downstream is.</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["SQL", "Power BI", "Python", "KPI Design", "Data Governance", "Stakeholder Mgmt"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(201,151,62,0.12)", color: "#C9973E", border: "1px solid rgba(201,151,62,0.25)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── OCT 2024 ── */}
                <div style={{ textAlign: "center", position: "relative", zIndex: 2, marginBottom: 36, marginTop: 12 }}>
                  <span style={{ display: "inline-block", fontFamily: "monospace", fontSize: 11, background: "#400909", color: "#FAF0DC", padding: "6px 20px", borderRadius: 20, letterSpacing: "0.06em" }}>
                    OCT 2024 – MAY 2025
                  </span>
                </div>

                <div className="mb-10 hidden items-start lg:grid" style={{ gridTemplateColumns: "1fr 56px 1fr", gap: "0 16px" }}>
                  {/* CPS photo mosaic — exact Figma positions (frame 619×856) */}
                  <div style={{ padding: 10, background: "linear-gradient(135deg, #6b2e0e 0%, #3a1508 100%)", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(80,30,20,0.35)", position: "relative" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "619 / 856", borderRadius: 8, overflow: "hidden", background: "#221008" }}>
                      <div style={{ position: "absolute", top: "7.76%", right: "15.72%", bottom: "67.98%", left: "15.72%" }}>
                        <img src="/images/cps/photo1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "35.08%", right: "58.08%", bottom: "39.13%", left: "16.01%" }}>
                        <img src="/images/cps/photo2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "69.95%", right: "11.94%", bottom: "9.84%", left: "42.21%" }}>
                        <img src="/images/cps/photo3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "54.86%", right: "34.79%", bottom: "28.31%", left: "42.21%" }}>
                        <img src="/images/cps/photo4.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "63.28%", right: "60.7%", bottom: "12.13%", left: "13.54%" }}>
                        <img src="/images/cps/photo5.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "33.77%", right: "15.72%", bottom: "45.14%", left: "45.27%" }}>
                        <img src="/images/cps/photo6.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: "clamp(7px, 1.4%, 10px)", letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>
                        CHICAGO PUBLIC SCHOOLS
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#C9973E", border: "3px solid #db5e5e", boxShadow: "0 0 0 2px rgba(44,14,14,0.5)", flexShrink: 0 }} />
                  </div>
                  <div style={{ background: "rgba(82,38,12,0.88)", borderRadius: 14, padding: 22, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", fontSize: 19, fontWeight: 700, color: "#FAF0DC", marginBottom: 3 }}>Graduate Student Assistant</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#C9973E", marginBottom: 12 }}>Chicago Public Schools — Administrative Testing Staff</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(201,151,62,0.12)", color: "rgba(250,240,220,0.85)", padding: "7px 12px", borderRadius: 6, marginBottom: 12, borderLeft: "3px solid #C9973E" }}>
                      📋 5,000+ student records managed across multiple school sites
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 14 }}>
                      {cpsDescription}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["Data Validation", "Excel", "Variance Analysis", "Process Improvement"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(201,151,62,0.12)", color: "#C9973E", border: "1px solid rgba(201,151,62,0.25)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-14 hidden items-start lg:grid" style={{ gridTemplateColumns: "1fr 56px 1fr", gap: "0 16px" }}>
                  <div style={{ background: "rgba(82,38,12,0.88)", borderRadius: 14, padding: 22, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", fontSize: 19, fontWeight: 700, color: "#FAF0DC", marginBottom: 3 }}>Data Science Consultant</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#C9973E", marginBottom: 12 }}>The Build Fellowship</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(201,151,62,0.12)", color: "rgba(250,240,220,0.85)", padding: "7px 12px", borderRadius: 6, marginBottom: 12, borderLeft: "3px solid #C9973E" }}>
                      💡 First time I realized data storytelling was the part I loved most
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 14 }}>
                      {dataScienceConsultantDescriptionFirstParagraph}{" "}{dataScienceConsultantDescriptionSecondParagraph}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["Predictive Modeling", "Python", "Dashboards", "Data Storytelling"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(201,151,62,0.12)", color: "#C9973E", border: "1px solid rgba(201,151,62,0.25)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#C9973E", border: "3px solid #db5e5e", boxShadow: "0 0 0 2px rgba(44,14,14,0.5)", flexShrink: 0 }} />
                  </div>
                  {/* Build Fellowship photo mosaic — exact Figma positions (frame 687×915) */}
                  <div style={{ padding: 10, background: "linear-gradient(135deg, #6b2e0e 0%, #3a1508 100%)", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(80,30,20,0.35)", position: "relative" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "687 / 915", borderRadius: 8, overflow: "hidden", background: "#221008" }}>
                      <div style={{ position: "absolute", top: "9.18%", right: "18.2%", bottom: "60.22%", left: "14.12%" }}>
                        <img src="/images/build/photo1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "62.62%", right: "13.25%", bottom: "10.38%", left: "20.23%" }}>
                        <img src="/images/build/photo2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "46.89%", right: "13.25%", bottom: "32.35%", left: "46.14%" }}>
                        <img src="/images/build/photo3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: "clamp(7px, 1.4%, 10px)", letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>
                        THE BUILD FELLOWSHIP
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-10 flex flex-col gap-6 lg:hidden">
                  <div style={{ padding: 10, background: "linear-gradient(135deg, #6b2e0e 0%, #3a1508 100%)", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(80,30,20,0.35)" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "619 / 856", borderRadius: 8, overflow: "hidden", background: "#221008" }}>
                      <div style={{ position: "absolute", top: "7.76%", right: "15.72%", bottom: "67.98%", left: "15.72%" }}><img src="/images/cps/photo1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "35.08%", right: "58.08%", bottom: "39.13%", left: "16.01%" }}><img src="/images/cps/photo2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "69.95%", right: "11.94%", bottom: "9.84%", left: "42.21%" }}><img src="/images/cps/photo3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "54.86%", right: "34.79%", bottom: "28.31%", left: "42.21%" }}><img src="/images/cps/photo4.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "63.28%", right: "60.7%", bottom: "12.13%", left: "13.54%" }}><img src="/images/cps/photo5.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "33.77%", right: "15.72%", bottom: "45.14%", left: "45.27%" }}><img src="/images/cps/photo6.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 8, letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>CHICAGO PUBLIC SCHOOLS</div>
                    </div>
                  </div>
                  <div style={{ background: "rgba(82,38,12,0.88)", borderRadius: 14, padding: 18, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", fontSize: 17, fontWeight: 700, color: "#FAF0DC", marginBottom: 3 }}>Graduate Student Assistant</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#C9973E", marginBottom: 10 }}>Chicago Public Schools — Administrative Testing Staff</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(201,151,62,0.12)", color: "rgba(250,240,220,0.85)", padding: "7px 12px", borderRadius: 6, marginBottom: 10, borderLeft: "3px solid #C9973E" }}>📋 5,000+ student records managed across multiple school sites</div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 12 }}>{cpsDescription}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["Data Validation", "Excel", "Variance Analysis", "Process Improvement"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(201,151,62,0.12)", color: "#C9973E", border: "1px solid rgba(201,151,62,0.25)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: 10, background: "linear-gradient(135deg, #6b2e0e 0%, #3a1508 100%)", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(80,30,20,0.35)" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "687 / 915", borderRadius: 8, overflow: "hidden", background: "#221008" }}>
                      <div style={{ position: "absolute", top: "9.18%", right: "18.2%", bottom: "60.22%", left: "14.12%" }}><img src="/images/build/photo1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "62.62%", right: "13.25%", bottom: "10.38%", left: "20.23%" }}><img src="/images/build/photo2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "46.89%", right: "13.25%", bottom: "32.35%", left: "46.14%" }}><img src="/images/build/photo3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 8, letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>THE BUILD FELLOWSHIP</div>
                    </div>
                  </div>
                  <div style={{ background: "rgba(82,38,12,0.88)", borderRadius: 14, padding: 18, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", fontSize: 17, fontWeight: 700, color: "#FAF0DC", marginBottom: 3 }}>Data Science Consultant</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#C9973E", marginBottom: 10 }}>The Build Fellowship</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(201,151,62,0.12)", color: "rgba(250,240,220,0.85)", padding: "7px 12px", borderRadius: 6, marginBottom: 10, borderLeft: "3px solid #C9973E" }}>💡 First time I realized data storytelling was the part I loved most</div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 12 }}>{dataScienceConsultantDescriptionFirstParagraph}{" "}{dataScienceConsultantDescriptionSecondParagraph}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["Predictive Modeling", "Python", "Dashboards", "Data Storytelling"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(201,151,62,0.12)", color: "#C9973E", border: "1px solid rgba(201,151,62,0.25)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── INFOSYS ── */}
                <div style={{ textAlign: "center", position: "relative", zIndex: 2, marginBottom: 36, marginTop: 12 }}>
                  <span style={{ display: "inline-block", fontFamily: "monospace", fontSize: 11, background: "#400909", color: "#FAF0DC", padding: "6px 20px", borderRadius: 20, letterSpacing: "0.06em" }}>
                    2019 – 2023 · INFOSYS
                  </span>
                </div>

                <div className="hidden items-start lg:grid" style={{ gridTemplateColumns: "1fr 56px 1fr", gap: "0 16px" }}>
                  {/* Infosys photo mosaic — exact Figma positions (frame 661×896) */}
                  <div style={{ padding: 10, background: "linear-gradient(135deg, #6b2e0e 0%, #3a1508 100%)", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(80,30,20,0.35)", position: "relative" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "661 / 896", borderRadius: 8, overflow: "hidden", background: "#221008" }}>
                      <div style={{ position: "absolute", top: "5.46%", right: "12.52%", bottom: "53.88%", left: "10.04%" }}>
                        <img src="/images/infosys/photo1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "38.36%", right: "54.29%", bottom: "29.29%", left: "13.1%" }}>
                        <img src="/images/infosys/photo2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "75.85%", right: "33.19%", bottom: "6.01%", left: "21.11%" }}>
                        <img src="/images/infosys/photo3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "43.28%", right: "11.06%", bottom: "38.14%", left: "51.82%" }}>
                        <img src="/images/infosys/photo4.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "69.29%", right: "66.38%", bottom: "17.6%", left: "7.28%" }}>
                        <img src="/images/infosys/photo5.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "58.8%", right: "8.15%", bottom: "10.6%", left: "55.17%" }}>
                        <img src="/images/infosys/photo6.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: "57.16%", right: "48.62%", bottom: "26.99%", left: "30.42%" }}>
                        <img src="/images/infosys/photo7.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: "clamp(7px, 1.4%, 10px)", letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>
                        INFOSYS LIMITED
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#C9973E", border: "3px solid #db5e5e", boxShadow: "0 0 0 2px rgba(44,14,14,0.5)", flexShrink: 0 }} />
                  </div>
                  <div style={{ background: "rgba(82,38,12,0.88)", borderRadius: 14, padding: 22, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", fontSize: 19, fontWeight: 700, color: "#FAF0DC", marginBottom: 3 }}>Technology Analyst</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#C9973E", marginBottom: 12 }}>Infosys Limited · Solvay Client · Bangalore</div>
                    {/* Role progression */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                      {[
                        { label: "Systems Engineer", active: false },
                        { label: "Senior Systems Engineer", active: false },
                        { label: "Technology Analyst", active: true },
                      ].map(({ label, active }, i, arr) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontFamily: "monospace", fontSize: 10, padding: "3px 9px", borderRadius: 4, color: active ? "#C9973E" : "rgba(250,240,220,0.45)", background: active ? "rgba(201,151,62,0.15)" : "rgba(250,240,220,0.05)", border: active ? "1px solid rgba(201,151,62,0.4)" : "1px solid rgba(250,240,220,0.1)", fontWeight: active ? 700 : 400 }}>{label}</span>
                          {i < arr.length - 1 && <span style={{ color: "rgba(250,240,220,0.25)", fontSize: 10 }}>→</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(201,151,62,0.12)", color: "rgba(250,240,220,0.85)", padding: "7px 12px", borderRadius: 6, marginBottom: 12, borderLeft: "3px solid #C9973E" }}>
                      🏆 RISE Award — Best Team, Project Excellence (FY24)
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 14 }}>
                      {infosysDescriptionFirstParagraph}{" "}{infosysDescriptionSecondParagraph}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["AWS", "Cloud Systems", "Automation", "Enterprise Clients", "ITIL V4"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(201,151,62,0.12)", color: "#C9973E", border: "1px solid rgba(201,151,62,0.25)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 lg:hidden">
                  <div style={{ padding: 10, background: "linear-gradient(135deg, #6b2e0e 0%, #3a1508 100%)", borderRadius: 18, boxShadow: "6px 8px 22px rgba(0,0,0,0.7), -3px -3px 10px rgba(80,30,20,0.35)" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "661 / 896", borderRadius: 8, overflow: "hidden", background: "#221008" }}>
                      <div style={{ position: "absolute", top: "5.46%", right: "12.52%", bottom: "53.88%", left: "10.04%" }}><img src="/images/infosys/photo1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "38.36%", right: "54.29%", bottom: "29.29%", left: "13.1%" }}><img src="/images/infosys/photo2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "75.85%", right: "33.19%", bottom: "6.01%", left: "21.11%" }}><img src="/images/infosys/photo3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "43.28%", right: "11.06%", bottom: "38.14%", left: "51.82%" }}><img src="/images/infosys/photo4.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "69.29%", right: "66.38%", bottom: "17.6%", left: "7.28%" }}><img src="/images/infosys/photo5.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "58.8%", right: "8.15%", bottom: "10.6%", left: "55.17%" }}><img src="/images/infosys/photo6.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", top: "57.16%", right: "48.62%", bottom: "26.99%", left: "30.42%" }}><img src="/images/infosys/photo7.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                      <div style={{ position: "absolute", bottom: "2%", left: 0, right: 0, textAlign: "center", fontFamily: "monospace", fontSize: 8, letterSpacing: "0.13em", color: "rgba(250,240,220,0.22)", textTransform: "uppercase" }}>INFOSYS LIMITED</div>
                    </div>
                  </div>
                  <div style={{ background: "rgba(82,38,12,0.88)", borderRadius: 14, padding: 18, boxShadow: "2px 4px 18px rgba(0,0,0,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-nunito),'Nunito Sans',sans-serif", fontSize: 17, fontWeight: 700, color: "#FAF0DC", marginBottom: 3 }}>Technology Analyst</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#C9973E", marginBottom: 10 }}>Infosys Limited · 2019–2023</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
                      {[
                        { label: "Systems Engineer", active: false },
                        { label: "Senior Systems Engineer", active: false },
                        { label: "Technology Analyst", active: true },
                      ].map(({ label, active }, i, arr) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontFamily: "monospace", fontSize: 9, padding: "2px 7px", borderRadius: 4, color: active ? "#C9973E" : "rgba(250,240,220,0.45)", background: active ? "rgba(201,151,62,0.15)" : "rgba(250,240,220,0.05)", border: active ? "1px solid rgba(201,151,62,0.4)" : "1px solid rgba(250,240,220,0.1)", fontWeight: active ? 700 : 400 }}>{label}</span>
                          {i < arr.length - 1 && <span style={{ color: "rgba(250,240,220,0.25)", fontSize: 9 }}>→</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, background: "rgba(201,151,62,0.12)", color: "rgba(250,240,220,0.85)", padding: "7px 12px", borderRadius: 6, marginBottom: 10, borderLeft: "3px solid #C9973E" }}>🏆 RISE Award — Best Team, Project Excellence (FY24)</div>
                    <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(250,240,220,0.65)", marginBottom: 12 }}>{infosysDescriptionFirstParagraph}{" "}{infosysDescriptionSecondParagraph}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["AWS", "Cloud Systems", "Automation", "Enterprise Clients", "ITIL V4"].map((t) => (
                        <span key={t} style={{ fontFamily: "monospace", fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(201,151,62,0.12)", color: "#C9973E", border: "1px solid rgba(201,151,62,0.25)" }}>{t}</span>
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
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="mx-auto w-fit lg:mx-0 lg:pl-32 lg:pr-[220px]"
                >
                  <div className="mx-auto w-fit max-w-full text-center lg:mx-0 lg:rotate-[0.3deg] lg:text-left">
                    <h2
                      className="inline-block max-w-full text-balance whitespace-normal lg:whitespace-nowrap"
                      style={{
                        fontFamily:
                          "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
                        fontSize: "clamp(1.35rem, 4vw, 2.5rem)",
                        fontWeight: 800,
                        fontStyle: "italic",
                        color: "#FAF0DC",
                        lineHeight: 1.1,
                        background: "#400909",
                        padding: "8px 14px",
                        display: "inline-block",
                      }}
                    >
                      certifications &amp; skills
                    </h2>
                    <div
                      style={{
                        height: 4,
                        background: "#FAF0DC",
                        marginTop: 6,
                        width: "100%",
                      }}
                    />
                    <p
                      className="mt-2 text-center font-mono text-[18px] lg:text-left"
                      style={{ color: "#ffffff", opacity: 0.8 }}
                    >
                      Spent a lot of time getting these certifications and skills
                    </p>
                  </div>
                </motion.div>

                <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.1fr_0.7fr]">
                  <motion.div
                    className="mt-5 lg:mt-20"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
                  >
                    <p className="mx-auto mb-2 max-w-[36ch] rotate-[-5deg] text-center font-sans text-[14px] font-extrabold italic leading-snug text-white md:text-[22px]">
                      Stickers don&apos;t lie. My laptop is basically my CV at
                      this point. The full list is on my resume. This is just the
                      fun version.
                    </p>
                    {/* SVG laptop with interactive hover zones over each sticker */}
                    <div style={{ position: "relative", maxWidth: 778 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={encodeURI("/images/Component 22.svg")}
                        alt="Laptop with skill stickers and technology logos"
                        width={778}
                        height={576}
                        className="h-auto w-full object-contain"
                      />
                      {/* Hover zones — positions as % of SVG 778×576 viewBox */}
                      {([
                        { label: "Python",       left: "6.7%",  top: "17.9%", w: "18.5%", h: "14.1%" },
                        { label: "R",            left: "33.0%", top: "15.8%", w: "10.3%", h: "11.8%" },
                        { label: "Tableau",      left: "51.2%", top: "17.4%", w: "19.9%", h: "15.1%" },
                        { label: "Google Cloud", left: "9.3%",  top: "31.6%", w: "21.7%", h: "16.5%" },
                        { label: "Jupyter",      left: "10.4%", top: "68.2%", w: "12.5%", h: "19.6%" },
                        { label: "AWS",          left: "55.7%", top: "45.0%", w: "19.9%", h: "15.1%" },
                        { label: "AWS (alt)",    left: "34.8%", top: "33.3%", w: "20.1%", h: "15.3%" },
                        { label: "GitHub",       left: "24.9%", top: "55.7%", w: "9.9%",  h: "12.5%" },
                        { label: "Excel",        left: "53.2%", top: "62.3%", w: "15.4%", h: "20.8%" },
                        { label: "CSS",          left: "34.8%", top: "55.7%", w: "9.9%",  h: "12.5%" },
                        { label: "JS",           left: "43.3%", top: "55.7%", w: "9.9%",  h: "12.5%" },
                        { label: "HTML",         left: "9.5%",  top: "47.9%", w: "12.9%", h: "14.6%" },
                        { label: "SQL",          left: "50.4%", top: "7.6%",  w: "10.8%", h: "12.5%" },
                        { label: "Power BI",     left: "29.9%", top: "69.6%", w: "10.0%", h: "15.1%" },
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

                    <a
                      href="/resume/Nupur-Gudigar-Resume.pdf"
                      download="Nupur-Gudigar-Resume.pdf"
                      aria-label="Download resume"
                      className="mx-auto mt-10 inline-flex w-fit translate-x-[2.25rem] items-center justify-center rounded-full border border-[#5b1111] bg-[#3d0909] px-9 py-3 font-sans text-[19px] font-extrabold italic leading-tight tracking-wide text-white shadow-[0_6px_14px_rgba(40,4,4,0.35)] transition duration-200 md:translate-x-28 lg:translate-x-40 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#db5e5e] md:text-[21px]"
                    >
                      DOWNLOAD RESUME
                    </a>
                  </motion.div>

                  <motion.div
                    className="mx-auto w-full max-w-[340px] lg:-mt-8"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
                  >
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
                      {[
                        { label: "Certification 1", href: "#", left: "13%", top: "48.69%", width: "74%", height: "14.17%" },
                        { label: "Certification 2", href: "#", left: "13%", top: "62.86%", width: "74%", height: "8.21%" },
                        { label: "Certification 3", href: "#", left: "13%", top: "69.76%", width: "74%", height: "14.17%" },
                        { label: "Certification 4", href: "#", left: "16%", top: "83.93%", width: "71%", height: "10.60%" },
                      ].map((cert) => (
                        <a
                          key={cert.label}
                          href={cert.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Verify ${cert.label}`}
                          className="absolute rounded transition-all duration-200 hover:ring-2 hover:ring-white/60"
                          style={{ left: cert.left, top: cert.top, width: cert.width, height: cert.height }}
                        />
                      ))}
                    </div>

                    <p className="mt-4 text-center font-sans text-[28px] font-extrabold italic leading-tight text-white md:text-[36px]">
                      I&apos;M CERTIFIED TOO
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          <BeyondResumeSection />

          {/* -- EXTRAS -- */}
          <div className="bg-[#db5e5e] px-4 pb-6 pt-10 text-center lg:hidden">
            <div className="mx-auto w-fit max-w-full">
              <h2
                className="inline-block max-w-full text-balance whitespace-normal"
                style={{
                  fontFamily:
                    "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
                  fontSize: "clamp(1.35rem, 4vw, 2.5rem)",
                  fontWeight: 800,
                  fontStyle: "italic",
                  color: "#FAF0DC",
                  lineHeight: 1.1,
                  background: "#400909",
                  padding: "8px 14px",
                  display: "inline-block",
                }}
              >
                life outside the terminal
              </h2>
              <div
                className="mx-auto"
                style={{
                  height: 4,
                  background: "#FAF0DC",
                  marginTop: 6,
                  width: "100%",
                  maxWidth: "min(100%, 28rem)",
                }}
              />
              <p
                className="mt-3 font-mono text-sm italic text-[#FAF0DC]/80"
              >
                Tap a photo to flip it (desktop: hover works too).
              </p>
            </div>
          </div>
          <div ref={extrasContainerRef} style={{ width: "100%" }}>
            <div
              style={{
                width: "100%",
                height: 1024 * extrasContainerScale,
                overflow: "visible",
                backgroundColor: "#db5e5e",
                margin: 0,
                padding: 0,
              }}
            >
              <div
                id="extras"
                className="scroll-mt-28"
                style={{
                  width: 1440,
                  height: 1024,
                  position: "relative",
                  transformOrigin: "top left",
                  transform: `scale(${extrasContainerScale})`,
                }}
              >
                {/* Corkboard */}
                <img
                  src="/images/Rectangle_89.png"
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 196,
                    top: 132,
                    width: 1315,
                    height: 863,
                    objectFit: "contain",
                  }}
                />
                {/* Photo container - clips to inner cork area */}
                <div
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 135,
                    top: 135,
                    width: 1250,
                    height: 800,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 157,
                      top: 76,
                      width: 411,
                      height: 211,
                      zIndex: 1,
                      transform: "rotate(-2deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Component 15.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Gaming Club Secretary
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Leading the gaming community as secretary — organizing
                          events, tournaments, and bringing gamers together.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 613,
                      top: 68,
                      width: 209,
                      height: 325,
                      zIndex: 2,
                      transform: "rotate(1.5deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Rectangle 68.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          PAWS Chicago Volunteer
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Volunteering at PAWS Chicago, helping rescue animals find
                          their forever homes.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 157,
                      top: 324,
                      width: 394,
                      height: 266,
                      zIndex: 1,
                      transform: "rotate(-1deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Rectangle 66.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Illinois Esports
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Competing and collaborating in the Illinois esports scene —
                          where passion meets strategy.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 632,
                      top: 417,
                      width: 242,
                      height: 185,
                      zIndex: 2,
                      transform: "rotate(2deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Rectangle 67.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Furry Friend
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          A wholesome encounter with this adorable service dog who
                          brightened everyone&apos;s day.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 1010,
                      top: 111,
                      width: 265,
                      height: 245,
                      zIndex: 1,
                      transform: "rotate(-1.5deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Rectangle 65.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Google Visit
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Exploring Google&apos;s office and getting inspired by the
                          culture of innovation.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 916,
                      top: 256,
                      width: 209,
                      height: 322,
                      zIndex: 2,
                      transform: "rotate(1deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Rectangle 64.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Google Chicago
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Visiting Google&apos;s Chicago office — a day full of learning
                          and inspiration.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 932,
                      top: 524,
                      width: 356,
                      height: 185,
                      zIndex: 1,
                      transform: "rotate(-0.5deg)",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      className="group"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition:
                          "transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(0deg)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "rotateX(180deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "rotateX(0deg)";
                      }}
                      onClick={toggleExtrasFlipOnTouch}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                        }}
                      >
                        <img
                          src={encodeURI("/images/Rectangle 63.svg")}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backfaceVisibility: "hidden",
                          transform: "rotateX(180deg)",
                          backgroundColor: "#f2f2f2",
                          borderRadius: 2,
                          boxShadow: "3px 4px 8px rgba(0, 0, 0, 0.35)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 20,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 18,
                            color: "#333",
                            fontWeight: 700,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          Team Photo
                        </h4>
                        <p
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#777",
                            lineHeight: 1.4,
                            fontFamily: "Nunito Sans, sans-serif",
                            textAlign: "center",
                          }}
                        >
                          A snapshot with an amazing group of peers and mentors who made
                          the journey memorable.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pushpins — one per photo, positioned near top-center of each */}
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 470,
                    top: 175,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 810,
                    top: 165,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 440,
                    top: 425,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 845,
                    top: 515,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 1230,
                    top: 210,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 1110,
                    top: 355,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                <img
                  src={encodeURI("/images/Rectangle 96.svg")}
                  alt=""
                  className="max-lg:-translate-x-[135px]"
                  style={{
                    position: "absolute",
                    left: 1210,
                    top: 625,
                    width: 78,
                    height: 87,
                    zIndex: 5,
                  }}
                />
                {/* Title — typography matches Projects section heading */}
                <div
                  className="hidden lg:block"
                  style={{
                    position: "absolute",
                    top: 40,
                    left: 300,
                    width: "fit-content",
                    transform: "rotate(0.4deg)",
                  }}
                >
                  <h2
                    style={{
                      fontFamily:
                        "var(--font-nunito), 'Nunito Sans', system-ui, sans-serif",
                      fontSize: 40,
                      fontWeight: 800,
                      fontStyle: "italic",
                      color: "#FAF0DC",
                      lineHeight: 1.1,
                      background: "#400909",
                      padding: "8px 20px",
                      display: "inline-block",
                      whiteSpace: "nowrap",
                    }}
                  >
                    life outside the terminal
                  </h2>
                  <div
                    style={{
                      height: 4,
                      background: "#FAF0DC",
                      marginTop: 6,
                      width: "100%",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: 18,
                      color: "rgba(250, 240, 220, 0.8)",
                      fontStyle: "italic",
                      marginTop: 8,
                    }}
                  >
                    psst... hover over the photos to flip them
                  </p>
                </div>
              </div>
            </div>
          </div>

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
                    style={{
                      height: 300,
                      width: "auto",
                      marginBottom: 16,
                      objectFit: "contain",
                    }}
                  />
                  <div
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
                      marginLeft: 64,
                      lineHeight: 1.1,
                    }}
                  >
                    let&apos;s talk!!
                  </div>
                  <p
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

                  {/* 2×2 contact cards — original SVG designs, uniform size */}
                  <div className="mb-[22px] grid grid-cols-2 gap-x-[14px] gap-y-[14px]">
                    {(
                      [
                        { href: "https://github.com/Nupur-Gudigar",               src: "/images/Component 17.svg", alt: "GitHub",  newTab: true  },
                        { href: "https://discord.com/users/422368252531048469",    src: "/images/Component 18.svg", alt: "Discord", newTab: true  },
                        { href: "mailto:nupurgudigar.tech@gmail.com",             src: "/images/Component 19.svg", alt: "Email",   newTab: false },
                        { href: "https://www.linkedin.com/in/nupur-gudigar",      src: "/images/Component 20.svg", alt: "LinkedIn",newTab: true  },
                      ] as const
                    ).map(({ href, src, alt, newTab }) => (
                      <a
                        key={alt}
                        href={href}
                        target={newTab ? "_blank" : undefined}
                        rel={newTab ? "noopener noreferrer" : undefined}
                        className={`flex transition-[filter] duration-300 hover:brightness-110`}
                        style={{
                          textDecoration: "none",
                          overflow: "visible",
                          alignItems: "center",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={encodeURI(src)}
                          alt={alt}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            transform: alt === "Email" || alt === "GitHub" ? "scale(1.35)" : undefined,
                          }}
                        />
                      </a>
                    ))}
                  </div>

                  {/* End pill */}
                  <div style={{ textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "rgba(44,14,14,0.3)",
                        border: "1px solid rgba(44,14,14,0.45)",
                        padding: "8px 18px",
                        borderRadius: 8,
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: "#FAF0DC",
                      }}
                    >
                      🎮 Achievement Made!&nbsp;&nbsp;The End?
                    </span>
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
          borderTop: "1px solid rgba(255,255,255,0.18)",
          padding: "16px 40px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontFamily: "var(--font-nunito), 'Nunito Sans', sans-serif",
            fontStyle: "italic",
            fontWeight: 700,
            color: "#f7ecec",
            lineHeight: 1.2,
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
