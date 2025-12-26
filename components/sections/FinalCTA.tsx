"use client";

import Button from "../ui/Button";
import { useContentContext } from "../ContentProvider";

export default function FinalCTA() {
  const { getSectionContent } = useContentContext();
  
  // Get content from backend, fallback to hardcoded if not found
  const title = getSectionContent("Final CTA", "title", "km") || "ត្រៀមខ្លួនផ្សព្វផ្សាយឱ្យកាន់តែឆ្លាតវៃ?";
  const description = getSectionContent("Final CTA", "description", "km") || "អតិថិជនរបស់អ្នកមាននៅលើកម្មវិធីផ្ញើសាររួចហើយ។ ទាក់ទងពួកគេឥឡូវនេះប្រកបដោយភាពវិជ្ជាជីវៈ — ក្នុងកម្រិតធំ។";
  const ctaPrimary = getSectionContent("Final CTA", "cta_primary", "km") || "Start Now";
  const ctaPrimaryLink = getSectionContent("Final CTA", "cta_primary_link", "km") || "https://t.me/iskillsbiz";
  const ctaSecondary = getSectionContent("Final CTA", "cta_secondary", "km") || "Contact Sales";
  const ctaSecondaryLink = getSectionContent("Final CTA", "cta_secondary_link", "km") || "https://t.me/iskillsbiz";

  return (
    <section className="py-10 sm:py-14 lg:py-18 bg-gradient-to-br from-primary-600 to-secondary-600 dark:from-primary-700 dark:to-secondary-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {title}
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            {description.includes(" — ") ? (
              description.split(" — ").map((part, i) => (
                <span key={i}>
                  {part}
                  {i < description.split(" — ").length - 1 && <br />}
                </span>
              ))
            ) : (
              description
            )}
          </p>
          <div className="flex flex-col items-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-2">
              <Button
                href={ctaPrimaryLink}
                variant="secondary"
                className="bg-white text-primary-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-primary-700 dark:hover:bg-gray-200"
              >
                {ctaPrimary}
              </Button>
              <Button
                href={ctaSecondaryLink}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 dark:border-white dark:text-white dark:hover:bg-white/20"
              >
                {ctaSecondary}
              </Button>
            </div>
            <p className="text-xs text-white/70 mt-2">
              No credit card required • Instant access after signup • Cancel anytime
            </p>
            <p className="text-sm text-white/80 mt-4 font-medium">
              Try iskillbiz without risk, no additional setup fees, cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

