"use client";

import { useState, useEffect } from "react";
import { useToast } from "../ui/Toast";

interface SectionEditorProps {
  section: any;
  onBack: () => void;
  onSave: () => void;
}

export default function SectionEditor({
  section,
  onBack,
  onSave,
}: SectionEditorProps) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    if (section.section_content) {
      const contentMap: Record<string, string> = {};
      section.section_content.forEach((item: any) => {
        const key = `${item.field_name}_${item.language}`;
        contentMap[key] = item.content || "";
      });
      setContent(contentMap);
    }
  }, [section]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Update each content field
      const updates = Object.entries(content).map(async ([key, value]) => {
        // Split from the end: language is always the last part after the last underscore
        // e.g., "cta_primary_en" -> fieldName: "cta_primary", language: "en"
        const lastUnderscoreIndex = key.lastIndexOf("_");
        if (lastUnderscoreIndex === -1) {
          throw new Error(`Invalid key format: ${key}`);
        }
        const fieldName = key.substring(0, lastUnderscoreIndex);
        const language = key.substring(lastUnderscoreIndex + 1);
        
        // Validate language
        if (!['km', 'en'].includes(language)) {
          throw new Error(`Invalid language: ${language}. Must be 'km' or 'en'`);
        }
        
        const response = await fetch(`${apiUrl}/api/sections/${section.id}/content`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fieldName,
            content: value,
            language,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(`Failed to save ${fieldName} (${language}): ${errorData.message || response.statusText}`);
        }

        return response.json();
      });

      await Promise.all(updates);
      showToast("Content saved successfully!", "success");
      onSave();
      setTimeout(() => onBack(), 1000);
    } catch (error: any) {
      console.error("Error saving content:", error);
      showToast(error.message || "Failed to save content", "error");
    } finally {
      setSaving(false);
    }
  };

  // Filter to show only Khmer (km) language
  const contentFields = (section.section_content || []).filter((item: any) => item.language === 'km');

  // Debug logging
  useEffect(() => {
    console.log("📝 SectionEditor - Section data:", section);
    console.log("📝 SectionEditor - Content fields (km only):", contentFields);
    console.log("📝 SectionEditor - Content state:", content);
  }, [section, contentFields, content]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2"
          >
            ← Back to Sections
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit: {section.name}
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

      {contentFields.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                No content fields found
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>This section doesn't have any content fields yet.</p>
                <p className="mt-1">
                  Section ID: <code className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">{section.id}</code>
                </p>
                <p className="mt-1">
                  Section Type: <code className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">{section.type}</code>
                </p>
                <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-800">
                  <p className="font-medium mb-2">How to add content fields:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Go to Supabase Dashboard → SQL Editor</li>
                    <li>Run the migration: <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">supabase/migrations/004_add_missing_content.sql</code></li>
                    <li>Or manually add content in Table Editor → <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">section_content</code></li>
                    <li>Refresh this page after adding content</li>
                  </ol>
                </div>
                <p className="mt-2 text-xs">
                  See <code className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">ADD_SECTION_CONTENT.md</code> for detailed instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {contentFields.map((item: any) => {
          const key = `${item.field_name}_${item.language}`;
          const isTextarea = item.content && item.content.length > 100;

          return (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {item.field_name} ({item.language})
              </label>
              {isTextarea ? (
                <textarea
                  value={content[key] || ""}
                  onChange={(e) =>
                    setContent({ ...content, [key]: e.target.value })
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                />
              ) : (
                <input
                  type="text"
                  value={content[key] || ""}
                  onChange={(e) =>
                    setContent({ ...content, [key]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                />
              )}
            </div>
          );
        })}
        </div>
      )}
      {ToastComponent}
    </div>
  );
}

