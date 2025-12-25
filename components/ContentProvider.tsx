"use client";

import { createContext, useContext, ReactNode } from "react";
import { useContent } from "@/lib/hooks/useContent";

interface ContentContextType {
  content: any;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getSectionContent: (sectionName: string, fieldName: string, language?: string) => string | null;
  getSection: (sectionName: string) => any | null;
  getPricingPlans: () => any[];
  getVideos: (sectionName?: string) => any[];
  getImages: (sectionName?: string, type?: string) => any[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const { content, loading, error, refetch } = useContent();

  const getSectionContent = (
    sectionName: string,
    fieldName: string,
    language: string = "km"
  ): string | null => {
    if (!content?.sections || content.sections.length === 0) {
      // Check if there's a warning about Supabase not being configured
      if (content?._warning) {
        console.warn("⚠️", content._warning);
      } else {
        console.log(`⚠️ No sections found for: ${sectionName}. Make sure Supabase is configured in .env.local`);
      }
      return null;
    }

    const section = content.sections.find(
      (s: any) => s.name === sectionName
    );
    if (!section) {
      console.log(`⚠️ Section not found: ${sectionName}`);
      return null;
    }
    if (!section?.content) {
      console.log(`⚠️ No content found for section: ${sectionName}`);
      return null;
    }

    const contentItem = section.content.find(
      (c: any) => c.field_name === fieldName && c.language === language
    );
    
    if (!contentItem) {
      console.log(`⚠️ Content item not found: ${sectionName}.${fieldName} (${language})`);
      return null;
    }
    
    console.log(`✅ Found content: ${sectionName}.${fieldName} (${language}) = ${contentItem.content}`);
    return contentItem?.content || null;
  };

  const getSection = (sectionName: string): any | null => {
    if (!content?.sections) return null;
    return content.sections.find((s: any) => s.name === sectionName) || null;
  };

  const getPricingPlans = (): any[] => {
    return content?.pricing || [];
  };

  const getVideos = (sectionName?: string): any[] => {
    if (!content?.videos) {
      console.log(`⚠️ No videos in content for section: ${sectionName || 'all'}`);
      return [];
    }
    if (!sectionName) return content.videos;

    const section = getSection(sectionName);
    if (!section) {
      console.log(`⚠️ Section not found for videos: ${sectionName}`);
      return [];
    }

    const filteredVideos = content.videos.filter((v: any) => v.section_id === section.id);
    console.log(`📹 Videos for "${sectionName}": ${filteredVideos.length} videos found`);
    return filteredVideos;
  };

  const getImages = (sectionName?: string, type?: string): any[] => {
    if (!content?.images) {
      console.log(`⚠️ No images in content for section: ${sectionName || 'all'}`);
      return [];
    }

    let filtered = content.images;

    if (sectionName) {
      const section = getSection(sectionName);
      if (section) {
        filtered = filtered.filter((i: any) => i.section_id === section.id);
        console.log(`🖼️ Images for "${sectionName}": ${filtered.length} images found`);
      } else {
        console.log(`⚠️ Section not found for images: ${sectionName}`);
        return [];
      }
    }

    if (type) {
      filtered = filtered.filter((i: any) => i.type === type);
    }

    return filtered;
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        error,
        refetch,
        getSectionContent,
        getSection,
        getPricingPlans,
        getVideos,
        getImages,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContentContext() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContentContext must be used within a ContentProvider");
  }
  return context;
}

