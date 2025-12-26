"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-[#111827] dark:bg-[#111827] flex items-center justify-center px-4 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative text-center space-y-8 max-w-2xl z-10">
        {/* 404 Number with Divider */}
        <div className="relative inline-block">
          <h1 className="text-9xl sm:text-[12rem] font-bold text-white leading-none tracking-tight">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-20 sm:h-28 bg-white/40"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            This page could not be found.
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          <Link
            href="/"
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

