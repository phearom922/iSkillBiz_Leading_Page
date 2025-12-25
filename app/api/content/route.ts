import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Check if Supabase is properly configured BEFORE creating client
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
                         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://dummy.supabase.co' &&
                         process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://');

    if (!isConfigured) {
      // Return empty data if Supabase is not configured
      // Frontend will use fallback static content
      console.warn("⚠️ Supabase not configured. Create .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
      return NextResponse.json({
        sections: [],
        pricing: [],
        videos: [],
        images: [],
        _warning: "Supabase not configured. Please create .env.local file with Supabase credentials.",
      });
    }

    const supabase = await createServerClient();

    // Fetch all active sections with their content
    const { data: sections, error: sectionsError } = await supabase
      .from("sections")
      .select("*")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (sectionsError) throw sectionsError;

    // Fetch content for all sections
    const sectionIds = sections.map((s) => s.id);
    const { data: content, error: contentError } = await supabase
      .from("section_content")
      .select("*")
      .in("section_id", sectionIds);

    if (contentError) throw contentError;

    // Fetch pricing plans
    const { data: pricing, error: pricingError } = await supabase
      .from("pricing_plans")
      .select("*")
      .order("order", { ascending: true });

    if (pricingError) throw pricingError;

    // Fetch active videos
    const { data: videos, error: videosError } = await supabase
      .from("youtube_videos")
      .select("*")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (videosError) throw videosError;

    // Fetch images
    const { data: images, error: imagesError } = await supabase
      .from("images")
      .select("*")
      .order("created_at", { ascending: false });

    if (imagesError) throw imagesError;

    // Organize content by section
    const sectionsWithContent = sections.map((section) => {
      const sectionContent = content.filter((c) => c.section_id === section.id);
      const sectionVideos = videos.filter((v) => v.section_id === section.id);
      const sectionImages = images.filter((i) => i.section_id === section.id);
      
      console.log(`📦 Section "${section.name}":`, {
        contentCount: sectionContent.length,
        videosCount: sectionVideos.length,
        imagesCount: sectionImages.length,
      });
      
      return {
        ...section,
        content: sectionContent,
        videos: sectionVideos,
        images: sectionImages,
      };
    });

    console.log(`✅ API Response:`, {
      sectionsCount: sectionsWithContent.length,
      totalVideos: videos.length,
      totalImages: images.length,
      totalContent: content.length,
    });

    return NextResponse.json({
      sections: sectionsWithContent,
      pricing,
      videos,
      images,
    });
  } catch (error: any) {
    console.error("Error fetching content:", {
      message: error.message,
      details: error.toString(),
      hint: error.hint || '',
      code: error.code || '',
    });

    // Handle timeout errors gracefully
    if (error.message?.includes('timeout') || error.message?.includes('ConnectTimeoutError')) {
      console.error("⚠️ Supabase connection timeout. Check your network connection and Supabase URL.");
      return NextResponse.json({
        sections: [],
        pricing: [],
        videos: [],
        images: [],
        _error: "Connection timeout. Please check your Supabase configuration and network connection.",
      }, { status: 503 }); // Service Unavailable
    }

    // Handle other errors
    return NextResponse.json(
      { 
        error: error.message || "Failed to fetch content",
        details: error.hint || error.toString(),
      },
      { status: 500 }
    );
  }
}

