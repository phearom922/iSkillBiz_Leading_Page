"use client";

import { useContentContext } from "./ContentProvider";
import Pricing from "./sections/Pricing";
import UseCases from "./sections/UseCases";
import SocialProof from "./sections/SocialProof";
import FeatureComparison from "./sections/FeatureComparison";
import UpsellBlocks from "./sections/UpsellBlocks";
import YouTubeSection from "./sections/YouTubeSection";
import DynamicSection from "./sections/DynamicSection";
import SectionDivider from "./SectionDivider";

interface SectionRendererProps {
  section: {
    id: string;
    name: string;
    type: string;
    section_type?: string;
    order: number;
    is_active: boolean;
  };
  index?: number;
  showDivider?: boolean;
}

export default function SectionRenderer({
  section,
  index = 0,
  showDivider = false,
}: SectionRendererProps) {
  // Don't render if section is inactive
  if (!section.is_active) {
    return null;
  }

  // Get section_type (fallback to type for backward compatibility)
  const sectionType = section.section_type || section.type;

  // Don't render hero, fixed, or footer sections here (handled separately in app/page.tsx)
  if (sectionType === 'hero' || sectionType === 'fixed' || sectionType === 'footer') {
    return null;
  }

  // Render based on section_type
  switch (sectionType) {
    case "youtube":
      // YouTube Section Type - use YouTubeSection component
      return (
        <>
          {showDivider && index > 0 && (
            <SectionDivider
              variant={index % 3 === 0 ? "blur" : index % 3 === 1 ? "gradient" : "soft"}
              className="my-0"
            />
          )}
          <YouTubeSection
            sectionName={section.name}
            className={
              index % 2 === 0
                ? "bg-white dark:bg-gray-900"
                : "bg-gray-50 dark:bg-gray-800"
            }
          />
        </>
      );

    case "content_block":
      // Content Block Type - render based on section name
      switch (section.name) {
        case "Use Cases":
          return (
            <>
              {showDivider && index > 0 && (
                <SectionDivider
                  variant={index % 3 === 0 ? "blur" : index % 3 === 1 ? "gradient" : "soft"}
                  className="my-0"
                />
              )}
              <UseCases />
            </>
          );

        case "Social Proof":
          return (
            <>
              {showDivider && index > 0 && (
                <SectionDivider
                  variant={index % 3 === 0 ? "blur" : index % 3 === 1 ? "gradient" : "soft"}
                  className="my-0"
                />
              )}
              <SocialProof />
            </>
          );

        case "Pricing":
          return (
            <>
              {showDivider && index > 0 && (
                <SectionDivider variant="gradient" className="my-0" />
              )}
              <Pricing />
            </>
          );

        case "Feature Comparison":
          return (
            <>
              {showDivider && index > 0 && (
                <SectionDivider
                  variant={index % 3 === 0 ? "blur" : index % 3 === 1 ? "gradient" : "soft"}
                  className="my-0"
                />
              )}
              <FeatureComparison />
            </>
          );

        case "Upsell Blocks":
        case "Upgrade Your Plan":
          return (
            <>
              {showDivider && index > 0 && (
                <SectionDivider
                  variant={index % 3 === 0 ? "blur" : index % 3 === 1 ? "gradient" : "soft"}
                  className="my-0"
                />
              )}
              <UpsellBlocks />
            </>
          );

        default:
          // Other content blocks - use DynamicSection
          return (
            <>
              {showDivider && index > 0 && (
                <SectionDivider
                  variant={index % 3 === 0 ? "blur" : index % 3 === 1 ? "gradient" : "soft"}
                  className="my-0"
                />
              )}
              <DynamicSection
                sectionName={section.name}
                className={
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800"
                }
              />
            </>
          );
      }

    default:
      // Default/legacy sections - use DynamicSection
      return (
        <>
          {showDivider && index > 0 && (
            <SectionDivider
              variant={index % 3 === 0 ? "blur" : index % 3 === 1 ? "gradient" : "soft"}
              className="my-0"
            />
          )}
          <DynamicSection
            sectionName={section.name}
            className={
              index % 2 === 0
                ? "bg-white dark:bg-gray-900"
                : "bg-gray-50 dark:bg-gray-800"
            }
          />
        </>
      );
  }
}

