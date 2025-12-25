import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class VideosService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(sectionId?: string) {
    const supabase = this.supabaseService.getClient();
    let query = supabase
      .from('youtube_videos')
      .select('*')
      .order('order', { ascending: true });

    if (sectionId) {
      query = query.eq('section_id', sectionId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async create(video: any) {
    const supabase = this.supabaseService.getClient();
    
    // Validate required fields
    if (!video.video_url) {
      throw new Error('video_url is required');
    }
    
    if (!video.section_id) {
      throw new Error('section_id is required');
    }
    
    // Extract video ID from URL
    const videoId = this.extractVideoId(video.video_url);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL. Could not extract video ID');
    }
    
    // Set default values
    const videoData = {
      section_id: video.section_id,
      video_url: video.video_url,
      video_id: videoId,
      title: video.title || null,
      order: video.order || 0,
      is_active: video.is_active !== undefined ? video.is_active : true,
    };
    
    console.log('Creating video with data:', videoData);
    
    const { data, error } = await supabase
      .from('youtube_videos')
      .insert(videoData)
      .select()
      .single();

    if (error) {
      console.error('Error creating video:', error);
      throw new Error(`Failed to create video: ${error.message}`);
    }
    
    return data;
  }

  async update(id: string, video: any) {
    const supabase = this.supabaseService.getClient();
    
    // Extract video ID if URL is provided
    if (video.video_url) {
      video.video_id = this.extractVideoId(video.video_url);
    }
    
    const { data, error } = await supabase
      .from('youtube_videos')
      .update(video)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('youtube_videos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Video deleted successfully' };
  }

  private extractVideoId(url: string): string {
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return url;
    }

    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
      return watchMatch[1];
    }

    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) {
      return shortMatch[1];
    }

    return url;
  }
}

