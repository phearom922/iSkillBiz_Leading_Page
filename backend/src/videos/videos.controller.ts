import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/videos')
export class VideosController {
  constructor(private videosService: VideosService) {}

  @Get()
  async findAll(@Query('section_id') sectionId?: string) {
    return this.videosService.findAll(sectionId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() video: any) {
    try {
      console.log('Received video data:', video);
      return await this.videosService.create(video);
    } catch (error: any) {
      console.error('Error in create video controller:', error);
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() video: any) {
    return this.videosService.update(id, video);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.videosService.delete(id);
  }
}

