"use client";

import Image from "next/image";
import { useLogo } from "@/lib/hooks/useLogo";

export default function LoadingPage() {
  const { logoUrl } = useLogo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center justify-center space-y-8 px-4">
        {/* Logo */}
        <div className="relative">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
            <Image
              src={logoUrl}
              alt="iSkillBiz Logo"
              width={160}
              height={160}
              className="w-full h-full object-contain animate-pulse"
              priority
            />
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 rounded-full bg-primary-600/20 animate-ping"></div>
          </div>
        </div>

        {/* Loading spinner */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-800 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          
          {/* Loading text */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Loading...
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Please wait while we prepare everything for you
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex space-x-2">
          <div 
            className="w-2.5 h-2.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce" 
            style={{ animationDelay: "0ms" }}
          ></div>
          <div 
            className="w-2.5 h-2.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce" 
            style={{ animationDelay: "150ms" }}
          ></div>
          <div 
            className="w-2.5 h-2.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-bounce" 
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

