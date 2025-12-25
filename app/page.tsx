"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import FixedSections from "@/components/FixedSections";
import SectionRenderer from "@/components/SectionRenderer";
import SectionDivider from "@/components/SectionDivider";
import { useContentContext } from "@/components/ContentProvider";

export default function Home() {
  const { content, loading } = useContentContext();

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading content...
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!content?.sections || content.sections.length === 0) {
    console.warn("⚠️ No sections found in content");
    return (
      <main className="min-h-screen">
        <Header />
        <div className="py-20 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No content available
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  // Filter active sections
  const activeSections = content.sections.filter((section: any) => section.is_active);

  // Get Hero Section (always first, order = 0)
  const heroSection = activeSections.find((s: any) => s.section_type === 'hero' || s.name === 'Hero Section');

  // Get YouTube Sections and Content Blocks (draggable, sorted by order)
  const draggableSections = activeSections
    .filter((s: any) => 
      (s.section_type === 'youtube' || s.section_type === 'content_block') &&
      s.name !== 'Hero Section' &&
      s.section_type !== 'fixed' &&
      s.section_type !== 'footer'
    )
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  console.log(
    `📋 Home: Rendering structure:`,
    {
      hero: heroSection?.name || 'Not found',
      draggable: draggableSections.map((s: any) => `${s.name} (${s.section_type}, order: ${s.order})`),
      fixed: '4 sections (hardcoded)',
    }
  );

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* 1. Hero Section - Always first, order = 0, not draggable */}
      {heroSection && <Hero />}
      
      {/* 2. YouTube Sections + Content Blocks - Draggable, sorted by order */}
      {draggableSections.length > 0 && (
        <>
          <SectionDivider variant="blur" className="my-0" />
          {draggableSections.map((section: any, index: number) => (
            <SectionRenderer
              key={section.id}
              section={section}
              index={index}
              showDivider={index > 0}
            />
          ))}
        </>
      )}

      {/* 3. Fixed Sections - Hardcoded, above footer, not draggable */}
      <FixedSections />

      {/* 4. Footer - Always last */}
      <Footer />
    </main>
  );
}
