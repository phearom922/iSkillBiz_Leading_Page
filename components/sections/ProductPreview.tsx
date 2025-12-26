export default function ProductPreview() {
  return (
    <section className="py-10 sm:py-14 lg:py-18 bg-white dark:bg-[#111827]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              See iskillbiz in Action
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
                {/* Placeholder dashboard mockup */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg
                      className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                      />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Dashboard Preview</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-base">
                A unified dashboard to manage broadcasts, subscribers, and automation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

