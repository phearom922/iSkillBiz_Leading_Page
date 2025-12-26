"use client";

import Card from "../ui/Card";
import { useContentContext } from "../ContentProvider";

const platforms = [
  {
    name: "Facebook Messenger",
    icon: (
      <svg
        className="w-12 h-12"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    icon: (
      <svg
        className="w-12 h-12"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.169 1.858-.896 6.375-1.269 8.45-.149.825-.442 1.1-.726 1.127-.619.05-1.088-.409-1.687-.802-.933-.64-1.463-1.038-2.37-1.663-1.003-.656-.353-1.017.219-1.606.15-.15 2.706-2.488 2.757-2.7.006-.022.011-.105-.041-.156-.052-.05-.129-.033-.185-.02-.079.017-1.331.847-3.758 2.487-.356.207-.679.308-.968.303-.32-.006-.936-.18-1.393-.329-.562-.183-.96-.279-.924-.59.021-.18.27-.365.744-.553 2.926-1.225 4.878-2.033 5.857-2.438 2.762-1.123 3.336-1.32 3.712-1.338.084-.004.27-.02.391.118.1.112.065.27.048.379z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    icon: (
      <svg
        className="w-12 h-12"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

export default function MultiPlatform() {
  const { getSectionContent } = useContentContext();
  
  // Get content from backend, fallback to hardcoded if not found
  const title = getSectionContent("Multi-Platform Support", "title", "km") || "Multi-Platform Support";
  const description = getSectionContent("Multi-Platform Support", "description", "km") || "Reach your customers wherever they are. More platforms coming soon.";

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {platforms.map((platform, index) => (
            <Card key={index} className="text-center card-hover">
              <div className="flex justify-center mb-4 text-primary-600 dark:text-primary-400">
                <div className="card-icon">{platform.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {platform.name}
              </h3>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400 italic">More platforms coming soon</p>
        </div>
      </div>
    </section>
  );
}

