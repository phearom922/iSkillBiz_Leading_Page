import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/pricing')
export class PricingController {
  constructor(private pricingService: PricingService) {}

  @Get()
  async findAll() {
    return this.pricingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pricingService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() plan: any) {
    return this.pricingService.update(id, plan);
  }
}

