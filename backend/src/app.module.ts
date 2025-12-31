import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { SectionsModule } from './sections/sections.module';
import { PricingModule } from './pricing/pricing.module';
import { VideosModule } from './videos/videos.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // In Docker, environment variables are injected via process.env
      // No need for envFilePath as Docker Compose handles this via env_file
    }),
    SupabaseModule,
    AuthModule,
    SectionsModule,
    PricingModule,
    VideosModule,
    ImagesModule,
  ],
})
export class AppModule {}

