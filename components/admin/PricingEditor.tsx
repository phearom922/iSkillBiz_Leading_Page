"use client";

import { useState } from "react";
import { useToast } from "../ui/Toast";

interface PricingEditorProps {
  plan: any;
  onBack: () => void;
  onSave: () => void;
}

export default function PricingEditor({
  plan,
  onBack,
  onSave,
}: PricingEditorProps) {
  const [formData, setFormData] = useState({
    price: plan.price,
    description: plan.description,
    features: plan.features.join("\n"),
    is_popular: plan.is_popular,
  });
  const [saving, setSaving] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      const response = await fetch(`${apiUrl}/api/pricing/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          features: formData.features.split("\n").filter((f: string) => f.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update pricing plan");
      }

      showToast("Pricing plan updated successfully!", "success");
      onSave();
      setTimeout(() => onBack(), 1000);
    } catch (error) {
      console.error("Error saving pricing:", error);
      showToast("Failed to save pricing plan", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2"
          >
            ← Back to Pricing
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit: {plan.name}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Features (one per line)
          </label>
          <textarea
            value={formData.features}
            onChange={(e) =>
              setFormData({ ...formData, features: e.target.value })
            }
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_popular}
              onChange={(e) =>
                setFormData({ ...formData, is_popular: e.target.checked })
              }
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mark as Most Popular
            </span>
          </label>
        </div>
      </div>
      {ToastComponent}
    </div>
  );
}

