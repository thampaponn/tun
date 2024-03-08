import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {

  constructor(private readonly repository: ReservationRepository) {}

  create(createReservationDto: CreateReservationDto) {
    return this.repository.upsertOne(Reservation.newInstanceFromDTO(createReservationDto));
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findByReserveId(id);
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    const existingObject = await this.repository.findByReserveId(id);
    if (updateReservationDto.detail) {
      existingObject.detail = updateReservationDto.detail;
    }
    existingObject.updatedAt = new Date();

    return this.repository.upsertOne(existingObject);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
