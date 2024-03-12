import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservation.repository';

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
    return this.repository.findByReservationId(id);
  }

  update(id: string, status: string) {
    return this.repository.update(id, status);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }
}
