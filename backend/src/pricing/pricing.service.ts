import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PricingService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, plan: any) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('pricing_plans')
      .update(plan)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

