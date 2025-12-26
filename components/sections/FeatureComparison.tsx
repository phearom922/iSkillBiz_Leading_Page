"use client";

import { useContentContext } from "../ContentProvider";

const comparisonData = [
  {
    feature: "Unlimited Bots",
    basic: true,
    standard: true,
    advance: true,
  },
  {
    feature: "Unlimited Broadcast",
    basic: true,
    standard: true,
    advance: true,
  },
  {
    feature: "AI Auto Reply",
    basic: true,
    standard: true,
    advance: true,
  },
  {
    feature: "Scheduling",
    basic: true,
    standard: true,
    advance: true,
  },
  {
    feature: "Import / Export",
    basic: true,
    standard: true,
    advance: true,
  },
  {
    feature: "Message Sequences",
    basic: false,
    standard: true,
    advance: true,
  },
  {
    feature: "Tag & Segment",
    basic: false,
    standard: true,
    advance: true,
  },
  {
    feature: "JSON API",
    basic: false,
    standard: true,
    advance: true,
  },
  {
    feature: "Webview Builder",
    basic: false,
    standard: true,
    advance: true,
  },
  {
    feature: "Advanced Automation",
    basic: false,
    standard: "Limited",
    advance: "Unlimited",
  },
  {
    feature: "High-volume Broadcast",
    basic: false,
    standard: "Medium",
    advance: "Unlimited",
  },
];

export default function FeatureComparison() {
  const { getSectionContent } = useContentContext();
  
  // Get content from backend, fallback to hardcoded if not found
  const title = getSectionContent("Feature Comparison", "title", "km") || "Feature Comparison";
  const description = getSectionContent("Feature Comparison", "description", "km") || "Compare plans side by side to find the perfect fit for your needs.";

  return (
    <section className="py-10 sm:py-14 lg:py-18 bg-white dark:bg-[#111827]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-gray-100">
                  Feature
                </th>
                <th className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-gray-100">
                  Basic
                </th>
                <th className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-gray-100 bg-primary-50 dark:bg-primary-900/20">
                  Standard
                </th>
                <th className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-gray-100">
                  Advance
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300 font-medium">
                    {row.feature}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {row.basic === true ? (
                      <svg
                        className="w-6 h-6 text-green-500 dark:text-green-400 mx-auto"
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
                    ) : row.basic === false ? (
                      <svg
                        className="w-6 h-6 text-red-500 dark:text-red-400 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">{row.basic}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center bg-primary-50 dark:bg-primary-900/20">
                    {row.standard === true ? (
                      <svg
                        className="w-6 h-6 text-green-500 dark:text-green-400 mx-auto"
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
                    ) : row.standard === false ? (
                      <svg
                        className="w-6 h-6 text-red-500 dark:text-red-400 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">{row.standard}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {row.advance === true ? (
                      <svg
                        className="w-6 h-6 text-green-500 dark:text-green-400 mx-auto"
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
                    ) : row.advance === false ? (
                      <svg
                        className="w-6 h-6 text-red-500 dark:text-red-400 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">{row.advance}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

