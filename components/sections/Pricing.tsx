"use client";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { useContentContext } from "../ContentProvider";

// Fallback plans if content is not available
const fallbackPlans = [
  {
    name: "Basic",
    price: 9,
    period: "30 Days",
    tagline: "Start broadcasting with confidence",
    badge: null,
    cta: "Start with Basic",
    features: [
      "Unlimited Bots",
      "Unlimited Broadcast",
      "AI Auto Reply",
      "Basic Automation",
      "Email Auto Responder",
      "Import / Export Subscribers",
    ],
    highlighted: false,
  },
  {
    name: "Standard",
    price: 19,
    period: "30 Days",
    tagline: "Built to grow engagement and sales",
    badge: "Most Popular",
    cta: "Choose Standard",
    features: [
      "Everything in Basic",
      "Message sequences & follow-ups",
      "Subscriber tags & segments",
      "Advanced engagement tools",
      "JSON API",
      "Webview Builder",
    ],
    highlighted: true,
  },
  {
    name: "Advance",
    price: 25,
    period: "30 Days",
    tagline: "Maximum power. Zero limits.",
    badge: "Built for Scale",
    cta: "Go Advance",
    features: [
      "Everything in Standard",
      "Unlimited automation",
      "Advanced API & Webhooks",
      "High-volume broadcasting",
      "Full integrations",
      "Built for teams & agencies",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  const { getPricingPlans, loading } = useContentContext();
  const dbPlans = getPricingPlans();
  
  // Use database plans if available, otherwise use fallback
  const plans = dbPlans.length > 0 
    ? dbPlans.map((plan: any) => ({
        name: plan.name,
        price: plan.price,
        period: "30 Days",
        tagline: plan.description || "",
        badge: plan.is_popular ? "Most Popular" : plan.name === "Advance" ? "Built for Scale" : null,
        cta: plan.name === "Basic" ? "Start with Basic" : plan.name === "Standard" ? "Choose Standard" : "Go Advance",
        features: Array.isArray(plan.features) ? plan.features : [],
        highlighted: plan.is_popular || false,
      }))
    : fallbackPlans;
  return (
    <section id="pricing" className="py-10 sm:py-14 lg:py-18 bg-gray-50 dark:bg-[#111827]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include 30 days of
            access.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              highlighted={plan.highlighted}
              className={`flex flex-col pricing-card ${
                plan.highlighted
                  ? "pricing-card-standard"
                  : "pricing-card-default"
              }`}
            >
              {plan.badge && (
                <div className="mb-4">
                  <Badge variant={plan.highlighted ? "primary" : "secondary"}>
                    {plan.badge}
                  </Badge>
                  {plan.name === "Standard" && (
                    <div className="mt-2">
                      <Badge variant="success" className="text-xs">
                        Best Value for Most Businesses
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  ${typeof plan.price === 'number' ? plan.price : plan.price.replace('$', '')}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">/{plan.period}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.tagline}</p>
              <div className="flex-grow mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Includes:</h4>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start text-gray-600 dark:text-gray-400">
                      <svg
                        className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5"
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
                      {item}
                    </li>
                  ))}
                </ul>
                {plan.name === "Standard" && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    Most customers choose this plan to scale faster with automation and segmentation.
                  </p>
                )}
              </div>
              <div className="mt-auto">
                <Button
                  href="https://t.me/iskillsbiz"
                  variant={plan.highlighted ? "primary" : "outline"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  No credit card required • Cancel anytime
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

