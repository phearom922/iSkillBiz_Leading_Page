import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Get()
  async findAll(@Query('section_id') sectionId?: string) {
    return this.imagesService.findAll(sectionId);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { sectionId?: string; type: string; altText?: string },
  ) {
    if (!file) {
      throw new Error('No file provided');
    }
    return this.imagesService.upload(file, {
      sectionId: body.sectionId,
      type: body.type || 'other',
      altText: body.altText || file.originalname,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.imagesService.delete(id);
  }
}

