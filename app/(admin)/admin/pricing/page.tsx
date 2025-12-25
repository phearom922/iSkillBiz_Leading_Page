"use client";

import { useEffect, useState } from "react";
import PricingEditor from "@/components/admin/PricingEditor";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  is_popular: boolean;
  order: number;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/pricing`);
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (selectedPlan) {
    return (
      <PricingEditor
        plan={selectedPlan}
        onBack={() => setSelectedPlan(null)}
        onSave={fetchPricing}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Pricing Plans
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-2 ${
              plan.is_popular
                ? "border-primary-500 dark:border-primary-400"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            {plan.is_popular && (
              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {plan.name}
            </h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ${plan.price}
              </span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {plan.description}
            </p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedPlan(plan)}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Edit Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

