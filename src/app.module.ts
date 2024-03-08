import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationModule } from './reservation/reservation.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [UsersModule, RoomsModule, ReservationModule, ReportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
