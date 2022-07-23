import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BackofficeService } from './backoffice.service';
import { CreateBackofficeDto } from './dto/create-backoffice.dto';
import { UpdateBackofficeDto } from './dto/update-backoffice.dto';

@Controller('backoffice')
export class BackofficeController {
  constructor(private readonly backofficeService: BackofficeService) {}

  @Post()
  create(@Body() createBackofficeDto: CreateBackofficeDto) {
    return this.backofficeService.create(createBackofficeDto);
  }

  @Get()
  findAll() {
    return this.backofficeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.backofficeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBackofficeDto: UpdateBackofficeDto) {
    return this.backofficeService.update(+id, updateBackofficeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backofficeService.remove(+id);
  }
}
