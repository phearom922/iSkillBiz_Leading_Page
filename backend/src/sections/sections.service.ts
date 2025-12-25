import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SectionsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('sections')
      .select('*, section_content(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(section: any) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('sections')
      .insert(section)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, section: any) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('sections')
      .update(section)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Section deleted successfully' };
  }

  async updateContent(sectionId: string, fieldName: string, content: string, language: string = 'km') {
    const supabase = this.supabaseService.getClient();
    
    // Validate language
    if (!['km', 'en'].includes(language)) {
      throw new Error(`Invalid language: ${language}. Must be 'km' or 'en'`);
    }
    
    try {
      // First, try to find existing content
      const { data: existing, error: findError } = await supabase
        .from('section_content')
        .select('*')
        .eq('section_id', sectionId)
        .eq('field_name', fieldName)
        .eq('language', language)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle not found gracefully

      if (findError) {
        console.error('Error finding section content:', findError);
        throw new Error(`Failed to find section content: ${findError.message}`);
      }

      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from('section_content')
          .update({
            content,
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating section content:', error);
          throw new Error(`Failed to update section content: ${error.message}`);
        }
        return data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('section_content')
          .insert({
            section_id: sectionId,
            field_name: fieldName,
            content,
            language,
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting section content:', error);
          throw new Error(`Failed to insert section content: ${error.message}`);
        }
        return data;
      }
    } catch (error: any) {
      console.error('updateContent error:', {
        sectionId,
        fieldName,
        language,
        error: error.message || error,
      });
      throw error;
    }
  }
}

