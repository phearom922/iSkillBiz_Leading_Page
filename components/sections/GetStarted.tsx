"use client";

import Button from "../ui/Button";
import Card from "../ui/Card";
import { useContentContext } from "../ContentProvider";

const steps = [
  {
    number: "1",
    title: "តភ្ជាប់វេទិកាផ្ញើសាររបស់អ្នក",
    description:
      "តភ្ជាប់ Facebook Messenger, Telegram, និង Instagram ក្នុងរយៈពេលតែប៉ុន្មានការចុច។ មិនត្រូវការការរៀបចំបច្ចេកទេសទេ។",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
        />
      </svg>
    ),
  },
  {
    number: "2",
    title: "ផ្ទុកឡើង ឬធ្វើសមកាលកម្មអតិថិជន",
    description:
      "នាំចូលបញ្ជីអតិថិជនដែលមានស្រាប់របស់អ្នកតាមរយៈ CSV ឬតភ្ជាប់ដោយផ្ទាល់។ ទស្សនិកជនរបស់អ្នកត្រៀមខ្លួនក្នុងរយៈពេលតែប៉ុន្មាននាទី។",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    ),
  },
  {
    number: "3",
    title: "ផ្ញើការផ្សព្វផ្សាយដំបូងរបស់អ្នក",
    description:
      "សរសេរសាររបស់អ្នក ជ្រើសរើសទស្សនិកជនរបស់អ្នក និងចុចផ្ញើ។ ទាក់ទងរាប់ពាន់នាក់ភ្លាមៗ ឬកំណត់ពេលសម្រាប់ពេលក្រោយ។",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    ),
  },
];

export default function GetStarted() {
  const { getSectionContent } = useContentContext();
  
  // Get content from backend, fallback to hardcoded if not found
  const title = getSectionContent("Get Started", "title", "km") || "ចាប់ផ្តើមក្នុងរយៈពេលតែប៉ុន្មាននាទី";
  const description = getSectionContent("Get Started", "description", "km") || "គ្មានការរៀបចំស្មុគ្រស្មាញ។ គ្មានការរង់ចាំ។ ចាប់ផ្តើមផ្សព្វផ្សាយទៅកាន់អតិថិជនរបស់អ្នកថ្ងៃនេះ។";

  return (
    <section className="py-10 sm:py-14 lg:py-18 bg-white dark:bg-[#111827]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {title}
            </h2>
            <p className="text-xl text-gray-700 dark:text-white/90 max-w-2xl mx-auto">
              {description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative text-center rounded-lg p-[2px] bg-gradient-to-br from-primary-600 to-secondary-600"
              >
                <div className="relative bg-gray-50 dark:bg-[#111827] rounded-lg p-6 h-full">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="pt-6">
                    <div className="flex justify-center mb-4 text-primary-600 dark:text-white">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-white/80">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button
              href="https://t.me/iskillsbiz"
              className="text-lg px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white border-none"
            >
              Start Now - It's Free to Try
            </Button>
            <p className="text-xs text-gray-600 dark:text-white/70 mt-3">
              មិនត្រូវការកាតឥណទាន • ការរៀបចំចំណាយពេលតិចជាង 10 នាទី
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

