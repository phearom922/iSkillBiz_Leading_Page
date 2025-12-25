"use client";

import { useContentContext } from "./ContentProvider";
import SectionRenderer from "./SectionRenderer";
import AnimatedSection from "./AnimatedSection";

export default function DynamicSections() {
  const { content, loading } = useContentContext();

  // Show loading state
  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading sections...
        </p>
      </div>
    );
  }

  if (!content?.sections || content.sections.length === 0) {
    console.warn("⚠️ No sections found in content");
    return null;
  }

  // Filter active sections and sort by order
  // Now includes ALL sections (no filtering of special sections)
  const activeSections = content.sections
    .filter((section: any) => section.is_active)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  console.log(
    `📋 DynamicSections: Found ${activeSections.length} sections to display (including all special sections)`
  );
  console.log(
    "📋 Sections order:",
    activeSections.map((s: any) => `${s.name} (order: ${s.order})`)
  );

  if (activeSections.length === 0) {
    console.warn("⚠️ No active sections to display");
    return null;
  }

  return (
    <>
      {activeSections.map((section: any, index: number) => (
        <AnimatedSection key={section.id} delay={index * 50}>
          <SectionRenderer
            section={section}
            index={index}
            showDivider={index > 0}
          />
        </AnimatedSection>
      ))}
    </>
  );
}
