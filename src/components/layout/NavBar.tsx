"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Fixed nav height; keep hero main wrapper `paddingTop` in sync. */
export const NAV_BAR_HEIGHT_PX = 76;

export function NavBar() {
  const [activeSection, setActiveSection] = useState<string>("about");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScrollListener = () => {
      const sections = ["about", "personal-projects", "experience", "extras", "contact"];
      const scrollPos = window.scrollY + NAV_BAR_HEIGHT_PX + 50;
      let current = "about";
      let minDistance = Infinity;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const distance = Math.abs(scrollPos - top);
        if (top <= scrollPos + el.offsetHeight && distance < minDistance) {
          minDistance = distance;
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScrollListener, { passive: true });
    window.addEventListener("resize", handleScrollListener, { passive: true });
    handleScrollListener();
    return () => {
      window.removeEventListener("scroll", handleScrollListener);
      window.removeEventListener("resize", handleScrollListener);
    };
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset =
        el.getBoundingClientRect().top + window.scrollY - NAV_BAR_HEIGHT_PX;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  const linkClass = (id: string) =>
    `cursor-pointer transition-all duration-300 font-sans font-extrabold italic ${activeSection === id
      ? "text-white underline underline-offset-4 decoration-2"
      : "text-[#1e1e1e] hover:opacity-70"
    }`;

  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-50 box-border flex items-center justify-end bg-[#db5e5e] px-4 text-right lg:px-8"
        style={{
          height: NAV_BAR_HEIGHT_PX,
          minHeight: NAV_BAR_HEIGHT_PX,
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
        aria-label="Primary"
      >
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex h-12 w-12 shrink-0 items-center justify-center border-0 bg-transparent p-0 lg:hidden"
          style={{ zIndex: 300, color: "#FAF0DC" }}
        >
          <span className="sr-only">Open menu</span>
          <span className="flex flex-col gap-1.5">
            <span className="h-[2px] w-7 rounded-sm bg-current" />
            <span className="h-[2px] w-7 rounded-sm bg-current" />
            <span className="h-[2px] w-7 rounded-sm bg-current" />
          </span>
        </button>

        <p className="hidden font-sans text-[20px] font-extrabold italic leading-tight text-[#1e1e1e] lg:block">
          <a
            href="#about"
            onClick={(e) => handleScroll(e, "about")}
            className={linkClass("about")}
          >
            ABOUT ME
          </a>
          {" / "}
          <a
            href="#personal-projects"
            onClick={(e) => handleScroll(e, "personal-projects")}
            className={linkClass("personal-projects")}
          >
            PROJECTS
          </a>
          {" / "}
          <a
            href="#experience"
            onClick={(e) => handleScroll(e, "experience")}
            className={linkClass("experience")}
          >
            WORK EXPERIENCE
          </a>
          {" / "}
          <a
            href="#extras"
            onClick={(e) => handleScroll(e, "extras")}
            className={linkClass("extras")}
          >
            EXTRAS
          </a>
          {" / "}
          <a
            href="#contact"
            onClick={(e) => handleScroll(e, "contact")}
            className={linkClass("contact")}
          >
            CONTACT
          </a>
        </p>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[290] flex items-center justify-center bg-[#400909] lg:hidden"
          >
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute right-6 top-5 border-0 bg-transparent p-0 text-[42px] leading-none text-[#FAF0DC]"
            >
              ×
            </button>

            <div
              className="flex flex-col items-center justify-center gap-8 text-center"
              style={{
                fontFamily: "var(--font-nunito), Nunito Sans, system-ui, sans-serif",
              }}
            >
              <a
                href="#about"
                onClick={(e) => handleScroll(e, "about")}
                className="text-[32px] font-extrabold italic text-[#FAF0DC]"
              >
                ABOUT ME
              </a>
              <a
                href="#personal-projects"
                onClick={(e) => handleScroll(e, "personal-projects")}
                className="text-[32px] font-extrabold italic text-[#FAF0DC]"
              >
                PROJECTS
              </a>
              <a
                href="#experience"
                onClick={(e) => handleScroll(e, "experience")}
                className="text-[32px] font-extrabold italic text-[#FAF0DC]"
              >
                WORK EXPERIENCE
              </a>
              <a
                href="#extras"
                onClick={(e) => handleScroll(e, "extras")}
                className="text-[32px] font-extrabold italic text-[#FAF0DC]"
              >
                EXTRAS
              </a>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, "contact")}
                className="text-[32px] font-extrabold italic text-[#FAF0DC]"
              >
                CONTACT
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
