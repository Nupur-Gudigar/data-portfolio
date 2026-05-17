"use client";

import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "idle" | "exiting";

export default function Home() {
  const router = useRouter();
  const handControls = useAnimationControls();
  const cardControls = useAnimationControls();

  const [glowActive, setGlowActive] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const exitStartedRef = useRef(false);

  const handleCardActivate = useCallback(async () => {
    if (phase !== "idle" || exitStartedRef.current) return;
    exitStartedRef.current = true;

    setPhase("exiting");
    setGlowActive(false);

    await handControls.start({
      scale: [1, 0.85, 1],
      transition: { duration: 0.2, times: [0, 0.5, 1] },
    });

    await cardControls.start({
      scale: 1.05,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    });

    router.push("/hero");
  }, [phase, router, handControls, cardControls]);

  useEffect(() => {
    const t = setTimeout(() => void handleCardActivate(), 8000);
    return () => clearTimeout(t);
  }, [handleCardActivate]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      void handleCardActivate();
    }
  };

  return (
    <div
      className={`relative min-h-screen w-full overflow-x-hidden ${phase === "idle" ? "cursor-pointer" : ""}`}
      style={{ background: "#0E0404" }}
      onClick={() => void handleCardActivate()}
    >
      <div className="flex min-h-screen w-full items-center justify-center px-4">
        <motion.div
          role="button"
          tabIndex={phase === "idle" ? 0 : -1}
          aria-label="Open portfolio"
          className={`relative z-10 w-fit ${
            phase === "idle"
              ? "cursor-pointer"
              : "pointer-events-none cursor-default"
          }`}
          initial={{ opacity: 1, scale: 1 }}
          animate={cardControls}
          onClick={() => void handleCardActivate()}
          onKeyDown={onKeyDown}
        >
          {/* Glow + card */}
          <motion.div
            className="rounded-[16px] overflow-hidden"
            animate={
              glowActive
                ? {
                    filter: [
                      "drop-shadow(0 0 8px rgba(200,114,96,0.5))",
                      "drop-shadow(0 0 22px rgba(200,114,96,0.85))",
                      "drop-shadow(0 0 8px rgba(200,114,96,0.5))",
                    ],
                  }
                : { filter: "drop-shadow(0 0 0px rgba(200,114,96,0))" }
            }
            transition={
              glowActive
                ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.15 }
            }
          >
            {/* Card image */}
            <div className="relative">
              <Image
                src="/images/hero/id-card.png"
                alt=""
                width={480}
                height={320}
                className="pointer-events-none mx-auto block h-auto w-full max-w-[480px]"
                priority
              />

              {/* Scanline overlay */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  borderRadius: 16,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: 4,
                    background: "rgba(180,20,40,0.9)",
                    boxShadow: "0 0 20px rgba(200,114,96,0.85)",
                    animation: "idScanline 2.2s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Pixel hand */}
          <motion.div
            className="pointer-events-none absolute -bottom-10 right-0 z-20 w-[100px]"
            initial={{ scale: 1 }}
            animate={handControls}
          >
            <motion.div
              className="will-change-transform"
              animate={phase === "idle" ? { y: [0, -8, 0] } : { y: 0 }}
              transition={
                phase === "idle"
                  ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            >
              <Image
                src="/images/hero/pixel-hand.png"
                alt=""
                width={100}
                height={100}
                className="h-auto w-[100px]"
                priority
                style={{
                  filter:
                    "invert(1) drop-shadow(0 0 6px rgba(255,255,255,1)) drop-shadow(0 0 4px rgba(0,0,0,0.5))",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enter hint */}
      <div
        className="absolute bottom-10 left-0 right-0 text-center"
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          animation: "idBlink 2s ease infinite",
          userSelect: "none",
        }}
      >
        ↸ click anywhere to enter
      </div>
    </div>
  );
}
