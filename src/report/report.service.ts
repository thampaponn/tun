import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportRepository } from './report.repository';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportService {

  constructor(private readonly repository: ReportRepository) { }

  create(createReportDto: CreateReportDto) {
    return this.repository.upsertOne(Report.newInstanceFromDTO(createReportDto));
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findByReportId(id);
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    const existingObject = await this.repository.findByReportId(id);
    if (updateReportDto.detail) {
      existingObject.detail = updateReportDto.detail;
    }
    existingObject.updatedAt = new Date();

    return this.repository.upsertOne(existingObject);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
