"use client";

import Card from "../ui/Card";
import { useContentContext } from "../ContentProvider";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "E-commerce Store Owner",
    company: "StyleHub",
    content:
      "iskillbiz saved me 10+ hours per week. I can now broadcast promotions to all my customers instantly, and engagement has increased by 40%. Game changer for my business.",
    avatar: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold text-lg">
        SC
      </div>
    ),
  },
  {
    name: "Michael Rodriguez",
    role: "Marketing Director",
    company: "TechLearn Academy",
    content:
      "We used to send messages one by one to our course students. Now we broadcast to thousands in seconds. Our course completion rates improved significantly thanks to timely reminders.",
    avatar: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-400 to-primary-400 flex items-center justify-center text-white font-semibold text-lg">
        MR
      </div>
    ),
  },
  {
    name: "Emily Watson",
    role: "Founder",
    company: "LocalBoutique",
    content:
      "As a small business owner, I needed something simple and effective. iskillbiz lets me manage all my chat platforms from one place. Customer response time improved dramatically, and sales are up 25%.",
    avatar: (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-lg">
        EW
      </div>
    ),
  },
];

export default function SocialProof() {
  const { getSectionContent } = useContentContext();
  
  // Get content from backend, fallback to hardcoded if not found
  const title = getSectionContent("Social Proof", "title", "km") || "Trusted by Growing Businesses";
  const description = getSectionContent("Social Proof", "description", "km") || "See how businesses like yours are using iskillbiz to reach more customers and grow faster.";

  return (
    <section className="py-10 sm:py-14 lg:py-18 bg-gray-50 dark:bg-[#111827]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-700 dark:text-white/90 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-lg p-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 flex flex-col"
            >
              <div className="flex items-center mb-4">
                {testimonial.avatar}
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-white/70">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-white/60">
                    {testimonial.company}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 dark:text-white/90 flex-grow">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

