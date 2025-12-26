"use client";

import GetStarted from "./sections/GetStarted";
import MultiPlatform from "./sections/MultiPlatform";
import Features from "./sections/Features";
import FinalCTA from "./sections/FinalCTA";
import SectionDivider from "./SectionDivider";

/**
 * FixedSections Component
 * 
 * Renders 4 fixed sections that are hardcoded and always appear above the footer:
 * 1. Get Started
 * 2. Multi-Platform Support
 * 3. Powerful Features
 * 4. Final CTA
 * 
 * These sections cannot be reordered or moved, and their content is hardcoded
 * (not editable from admin dashboard).
 */
export default function FixedSections() {
  return (
    <>
      <GetStarted />
      <MultiPlatform />
      <SectionDivider variant="gradient" className="my-0" />
      <Features />
      <FinalCTA />
    </>
  );
}

