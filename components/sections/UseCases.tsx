"use client";

import { useContentContext } from "../ContentProvider";

const useCases = [
  "E-commerce & ហាងអនឡាញ",
  "ការសិក្សាតាមរយៈអនឡាញ",
  "ក្រុមអ្នកលក់",
  "ភ្នាក់ងារ",
  "SMEs",
];

export default function UseCases() {
  const { getSectionContent } = useContentContext();
  
  // Get content from backend, fallback to hardcoded if not found
  const title = getSectionContent("Use Cases", "title", "km") || "ល្អបំផុតសម្រាប់";
  const description = getSectionContent("Use Cases", "description", "km") || "អាជីវកម្មទាំងអស់ប្រើប្រាស់ iskillbiz ដើម្បីផ្ញើរសារទៅកាន់អតិថិជនរបស់ពួកគេឱ្យមានប្រសិទ្ធភាព";

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-gray-900 dark:bg-gray-950 justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {title}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          {/* Row 1: 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
            {useCases.slice(0, 3).map((useCase, index) => (
              <div
                key={index}
                className="relative text-center rounded-lg p-6 bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-800"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-white font-medium text-base leading-tight">
                  {useCase}
                </p>
              </div>
            ))}
          </div>
          {/* Row 2: 2 cards centered */}
          <div className="flex justify-center gap-4 md:gap-6">
            {useCases.slice(3, 5).map((useCase, index) => (
              <div
                key={index + 3}
                className="relative text-center rounded-lg p-6 bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-800 w-full max-w-xs"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-white font-medium text-base leading-tight">
                  {useCase}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
