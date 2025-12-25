import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SectionsService } from './sections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/sections')
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}

  @Get()
  async findAll() {
    return this.sectionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sectionsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() section: any) {
    return this.sectionsService.create(section);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() section: any) {
    return this.sectionsService.update(id, section);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.sectionsService.delete(id);
  }

  @Put(':id/content')
  @UseGuards(JwtAuthGuard)
  async updateContent(
    @Param('id') sectionId: string,
    @Body() body: { fieldName: string; content: string; language?: string },
  ) {
    try {
      if (!body.fieldName || body.content === undefined) {
        throw new Error('fieldName and content are required');
      }

      return await this.sectionsService.updateContent(
        sectionId,
        body.fieldName,
        body.content,
        body.language || 'km',
      );
    } catch (error: any) {
      console.error('Error in updateContent controller:', error);
      throw error;
    }
  }
}

