import { Injectable } from '@nestjs/common';
import { CreateBackofficeDto } from './dto/create-backoffice.dto';
import { UpdateBackofficeDto } from './dto/update-backoffice.dto';

@Injectable()
export class BackofficeService {
  create(createBackofficeDto: CreateBackofficeDto) {
    return 'This action adds a new backoffice';
  }

  findAll() {
    return `This action returns all backoffice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} backoffice`;
  }

  update(id: number, updateBackofficeDto: UpdateBackofficeDto) {
    return `This action updates a #${id} backoffice`;
  }

  remove(id: number) {
    return `This action removes a #${id} backoffice`;
  }
}
