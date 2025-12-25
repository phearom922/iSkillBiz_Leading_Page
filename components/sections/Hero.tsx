"use client";

import Image from "next/image";
import Button from "../ui/Button";
import BroadcastAnimation from "../BroadcastAnimation";
import { useContentContext } from "../ContentProvider";

export default function Hero() {
  const { getSectionContent, getImages, loading } = useContentContext();

  // Fallback to static content if loading or not found
  const headline =
    getSectionContent("Hero Section", "headline", "km") ||
    "ផ្សព្វផ្សាយទៅកាន់អតិថិជនរាប់ពាន់នាក់ — ដោយមិនត្រូវការធ្វើពាណិជ្ជកម្ម ឬការងារដៃផ្ទាល់";
  const subheadline =
    getSectionContent("Hero Section", "subheadline", "km") ||
    "iskillbiz ជួយអាជីវកម្មនៃការផ្ញើសារទៅជាបណ្តាញដែលមានប្រសិទ្ធភាពខ្ពស់បំផុត ដោយប្រើប្រាស់ការផ្សព្វផ្សាយស្វ័យប្រវត្តិ និង ប្រើប្រាស់ AI ឲ្យធ្វើការ";
  const ctaPrimary =
    getSectionContent("Hero Section", "cta_primary", "km") || "Start Now";
  const ctaPrimaryLink =
    getSectionContent("Hero Section", "cta_primary_link", "km") ||
    "https://t.me/iskillsbiz";
  const ctaSecondary =
    getSectionContent("Hero Section", "cta_secondary", "km") || "View Pricing";
  const ctaSecondaryLink =
    getSectionContent("Hero Section", "cta_secondary_link", "km") ||
    "#pricing";

  // Get hero images from database
  const heroImages = getImages("Hero Section", "hero");
  const heroImage = heroImages.length > 0 ? heroImages[0] : null;

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 py-20 sm:py-24 lg:py-32 overflow-hidden">
      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-purple-950/20 dark:from-blue-900/30 dark:to-purple-900/30"></div>

      {/* Glow effect behind headline */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-in drop-shadow-lg">
              <span className="relative z-10">{headline}</span>
              {/* Subtle text glow */}
              <span className="absolute inset-0 text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-400/20 blur-xl -z-0">
                {headline}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200/90 mb-10 max-w-2xl mx-auto lg:mx-0">
              {subheadline}
            </p>
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-2">
                <Button
                  href={ctaPrimaryLink}
                  variant="primary"
                  className="hero-cta-primary"
                >
                  {ctaPrimary}
                </Button>
                <Button
                  href={ctaSecondaryLink}
                  variant="outline"
                  className="hero-cta-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  {ctaSecondary}
                </Button>
              </div>
              <p className="text-xs text-gray-300/70 mt-2">
                No credit card required • Instant access • Cancel anytime
              </p>
            </div>
          </div>

          {/* Right side - Visuals (desktop) / Below (mobile) */}
          <div className="order-1 lg:order-2 flex flex-col items-center justify-center relative">
            {/* Layered Visuals Container */}
            <div className="relative w-full max-w-lg">
              {/* Dashboard Mockup - Background Layer */}
              {heroImage && (
                <div className="absolute inset-0 top-8 left-0 right-0 opacity-40 lg:opacity-30">
                  <div className="relative rounded-xl overflow-hidden shadow-xl border border-white/10 backdrop-blur-sm">
                    <div className="aspect-video relative">
                      <Image
                        src={heroImage.image_url}
                        alt={heroImage.alt_text || "iskillbiz Dashboard Preview"}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Fallback to hardcoded image if no database image */}
              {!heroImage && (
                <div className="absolute inset-0 top-8 left-0 right-0 opacity-40 lg:opacity-30">
                  <div className="relative rounded-xl overflow-hidden shadow-xl border border-white/10 backdrop-blur-sm">
                    <div className="aspect-video relative">
                      <Image
                        src="/images/Dashborad_Mokup.png"
                        alt="iskillbiz Dashboard Preview"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Broadcast Animation - Foreground Layer */}
              <div className="relative z-10 pt-8">
                <BroadcastAnimation />
              </div>
            </div>

            {/* Caption */}
            <p className="text-sm text-gray-400/70 mt-6 text-center max-w-xs relative z-10">
              ផ្សព្វផ្សាយស្វ័យប្រវត្តិ និង ប្រើប្រាស់ AI
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

