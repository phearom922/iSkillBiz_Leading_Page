"use client";

import { useEffect, useRef, useState } from "react";

const flowSteps = [
  {
    title: "ផ្សព្វផ្សាយ",
    description: "ផ្ញើសាររបស់អ្នកទៅកាន់រាប់ពាន់នាក់",
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
  {
    title: "អតិថិជន",
    description: "ទទួលសារភ្លាមៗ",
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    title: "AI Reply",
    description: "ការឆ្លើយតបឆ្លាតវៃស្វ័យប្រវត្តិ",
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
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    title: "តាមដាន",
    description: "ទាក់ទងជាមួយលំដាប់",
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
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
  {
    title: "ការបំប្លែង",
    description: "ជំរុញសកម្មភាព និងការលក់",
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
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default function ChatFlowDiagram() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % flowSteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-14 lg:py-18 bg-white dark:bg-[#111827]"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            ការធ្វើស្វ័យប្រវត្តិ Chat ដំណើរការយ៉ាងដូចម្តេច
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            មើលពីរបៀបដែលការផ្ញើសារស្វ័យប្រវត្តិដំណើរការ
          </p>
        </div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:flex items-center justify-center max-w-6xl mx-auto">
          <div className="flex items-center w-full gap-4">
            {flowSteps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div
                  className={`flex-1 flow-step-card ${
                    isVisible ? "flow-step-visible" : ""
                  } ${
                    activeStep === index ? "flow-step-active" : ""
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center transition-premium flow-step-inner">
                    <div className="flex justify-center mb-4 text-primary-600 dark:text-primary-400 flow-step-icon">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow between steps */}
                {index < flowSteps.length - 1 && (
                  <div
                    className={`mx-2 flex-shrink-0 flow-arrow ${
                      isVisible ? "flow-arrow-visible" : ""
                    }`}
                    style={{
                      transitionDelay: `${(index + 1) * 100}ms`,
                    }}
                  >
                    <svg
                      className="w-8 h-8 text-gray-300 dark:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical Flow */}
        <div className="lg:hidden max-w-md mx-auto">
          <div className="flex flex-col items-center gap-4">
            {flowSteps.map((step, index) => (
              <div key={index} className="w-full">
                <div
                  className={`flow-step-card ${
                    isVisible ? "flow-step-visible" : ""
                  } ${
                    activeStep === index ? "flow-step-active" : ""
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center transition-premium flow-step-inner">
                    <div className="flex justify-center mb-4 text-primary-600 dark:text-primary-400 flow-step-icon">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Downward arrow */}
                {index < flowSteps.length - 1 && (
                  <div
                    className={`flex justify-center my-2 flow-arrow ${
                      isVisible ? "flow-arrow-visible" : ""
                    }`}
                    style={{
                      transitionDelay: `${(index + 1) * 100}ms`,
                    }}
                  >
                    <svg
                      className="w-6 h-6 text-gray-300 dark:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

