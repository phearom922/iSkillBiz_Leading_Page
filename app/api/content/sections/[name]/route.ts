import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { name } = await params;
    const sectionName = decodeURIComponent(name);

    // Fetch section by name
    const { data: section, error: sectionError } = await supabase
      .from("sections")
      .select("*")
      .eq("name", sectionName)
      .eq("is_active", true)
      .single();

    if (sectionError || !section) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    // Fetch content for this section
    const { data: content, error: contentError } = await supabase
      .from("section_content")
      .select("*")
      .eq("section_id", section.id);

    if (contentError) throw contentError;

    // Fetch videos for this section
    const { data: videos, error: videosError } = await supabase
      .from("youtube_videos")
      .select("*")
      .eq("section_id", section.id)
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (videosError) throw videosError;

    // Fetch images for this section
    const { data: images, error: imagesError } = await supabase
      .from("images")
      .select("*")
      .eq("section_id", section.id);

    if (imagesError) throw imagesError;

    return NextResponse.json({
      section: {
        ...section,
        content,
        videos,
        images,
      },
    });
  } catch (error: any) {
    console.error("Error fetching section:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch section" },
      { status: 500 }
    );
  }
}

