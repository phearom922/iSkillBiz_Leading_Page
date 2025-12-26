"use client";

import Card from "../ui/Card";
import Button from "../ui/Button";
import { useContentContext } from "../ContentProvider";

const upsells = [
  {
    title: "Ready to Unlock Sequences & Segmentation?",
    description:
      "Upgrade from Basic to Standard and unlock powerful features that help you engage customers more effectively.",
    features: [
      "Message sequences & follow-ups",
      "Subscriber tags & segments",
      "JSON API access",
      "Webview Builder",
    ],
    from: "Basic",
    to: "Standard",
    price: "Only $10 more",
  },
  {
    title: "Need Unlimited Automation & Integrations?",
    description:
      "Upgrade from Standard to Advance and get unlimited power for teams and agencies.",
    features: [
      "Unlimited automation",
      "Advanced API & Webhooks",
      "High-volume broadcasting",
      "Full integrations suite",
    ],
    from: "Standard",
    to: "Advance",
    price: "Only $6 more",
  },
];

export default function UpsellBlocks() {
  const { getSectionContent } = useContentContext();
  
  // Get content from backend, fallback to hardcoded if not found
  const title = getSectionContent("Upsell Blocks", "title", "km") || "Upgrade Your Plan";
  const description = getSectionContent("Upsell Blocks", "description", "km") || "Get more features and unlock the full potential of your broadcasting campaigns.";

  return (
    <section className="py-10 sm:py-14 lg:py-18 bg-gray-50 dark:bg-[#111827]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {upsells.map((upsell, index) => (
            <Card key={index} className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {upsell.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{upsell.description}</p>
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Upgrade from {upsell.from} to {upsell.to} - {upsell.price}
                </p>
                <ul className="space-y-2">
                  {upsell.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-600 dark:text-gray-400">
                      <svg
                        className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5"
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
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button href="#pricing" variant="primary" className="w-full">
                View {upsell.to} Plan
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

