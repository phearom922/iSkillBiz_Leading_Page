import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ImagesService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(sectionId?: string) {
    const supabase = this.supabaseService.getClient();
    let query = supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (sectionId) {
      query = query.eq('section_id', sectionId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async upload(file: Express.Multer.File, metadata: { sectionId?: string; type: string; altText?: string }) {
    if (!file || !file.buffer) {
      throw new Error('Invalid file');
    }
    const supabase = this.supabaseService.getClient();
    
    // Upload to Supabase Storage
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    // Save to images table
    const { data, error } = await supabase
      .from('images')
      .insert({
        section_id: metadata.sectionId || null,
        image_url: urlData.publicUrl,
        alt_text: metadata.altText || file.originalname,
        type: metadata.type,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const supabase = this.supabaseService.getClient();
    
    // Get image record first
    const { data: image, error: fetchError } = await supabase
      .from('images')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Extract file path from URL
    const url = new URL(image.image_url);
    const filePath = url.pathname.split('/storage/v1/object/public/images/')[1];

    if (filePath) {
      // Delete from storage
      await supabase.storage
        .from('images')
        .remove([filePath]);
    }

    // Delete from database
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Image deleted successfully' };
  }
}

