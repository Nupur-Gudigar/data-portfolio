"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Fixed nav height; keep hero main wrapper `paddingTop` in sync. */
export const NAV_BAR_HEIGHT_PX = 44;

export function NavBar() {
  const [activeSection, setActiveSection] = useState<string>("about");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const sections = ["about", "personal-projects", "experience", "certifications-preview", "extras", "contact"];

    const handleScrollListener = () => {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const pageH = document.documentElement.scrollHeight;

      // On tall monitors the last sections can never scroll to the top of the viewport,
      // so once you've hit the absolute bottom of the page, contact wins unconditionally.
      if (scrollY + viewportH >= pageH - 2) {
        setActiveSection("contact");
        return;
      }

      const threshold = scrollY + NAV_BAR_HEIGHT_PX + 8;
      let current = sections[0];

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + scrollY;
        if (top <= threshold) current = id;
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

  const linkStyle = (id: string): React.CSSProperties =>
    activeSection === id
      ? {
          color: "#fff",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 4,
          padding: "4px 8px",
        }
      : {
          color: "rgba(255,255,255,0.45)",
          padding: "4px 8px",
        };

  const separatorStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.18)",
    userSelect: "none",
    fontSize: 10,
  };

  const navLinks = [
    { id: "about", label: "ABOUT ME" },
    { id: "personal-projects", label: "PROJECTS" },
    { id: "experience", label: "WORK EXPERIENCE" },
    { id: "certifications-preview", label: "SKILLS" },
    { id: "extras", label: "EXTRAS" },
    { id: "contact", label: "CONTACT" },
  ];

  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-50 box-border flex items-center justify-end"
        style={{
          height: NAV_BAR_HEIGHT_PX,
          minHeight: NAV_BAR_HEIGHT_PX,
          background: "rgba(26,6,6,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
          paddingRight: "max(1.25rem, env(safe-area-inset-right))",
        }}
        aria-label="Primary"
      >
        {/* Desktop links */}
        <div
          className="hidden items-center lg:flex"
          style={{
            fontFamily: "var(--font-nunito), Nunito Sans, system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {navLinks.map((link, i) => (
            <React.Fragment key={link.id}>
              {i > 0 && <span style={separatorStyle}>/</span>}
              <a
                href={`#${link.id}`}
                onClick={(e) => handleScroll(e, link.id)}
                style={linkStyle(link.id)}
                className="cursor-pointer transition-all duration-200"
              >
                {link.label}
              </a>
            </React.Fragment>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex h-12 w-12 shrink-0 items-center justify-center border-0 bg-transparent p-0 lg:hidden"
          style={{ zIndex: 300, color: "rgba(255,255,255,0.6)" }}
        >
          <span className="sr-only">Open menu</span>
          <span className="flex flex-col gap-1.5">
            <span className="h-[2px] w-7 rounded-sm bg-current" />
            <span className="h-[2px] w-7 rounded-sm bg-current" />
            <span className="h-[2px] w-7 rounded-sm bg-current" />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[290] flex items-center justify-center lg:hidden"
            style={{ background: "rgba(26,6,6,0.97)", backdropFilter: "blur(12px)" }}
          >
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute right-6 top-5 border-0 bg-transparent p-0 text-[42px] leading-none"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              ×
            </button>

            <div
              className="flex flex-col items-center justify-center gap-8 text-center"
              style={{
                fontFamily: "var(--font-nunito), Nunito Sans, system-ui, sans-serif",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleScroll(e, link.id)}
                  style={{
                    fontSize: 28,
                    color: activeSection === link.id ? "#fff" : "rgba(255,255,255,0.55)",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
