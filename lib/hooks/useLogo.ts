"use client";

import { useState, useEffect } from "react";

export function useLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        // Remove trailing /api if present to avoid double /api/api
        const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
        const response = await fetch(`${baseUrl}/api/images?type=logo`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const images = await response.json();
          // Get the first logo image (most recent, ordered by created_at desc)
          if (images && images.length > 0) {
            const logoImage = images[0]; // Already filtered by type=logo and ordered by created_at desc
            if (logoImage && logoImage.image_url) {
              setLogoUrl(logoImage.image_url);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

  // Fallback to default logo if no logo found in database
  const defaultLogo = "/images/iSkillBiz_logo_Officia.png";
  return { logoUrl: logoUrl || defaultLogo, loading };
}

