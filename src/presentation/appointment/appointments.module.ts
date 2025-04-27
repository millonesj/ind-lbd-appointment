import { Module } from '@nestjs/common';
import { AppointmentController } from '../appointment.controller';
import { AppointmentService } from 'src/application/appointment/appointment.service';
import { APPOINTMENT_REPOSITORY } from '../../infraestructure/dynamodb/appointment.interface';
import { DynamoDBAppointmentRepository } from 'src/infraestructure/dynamodb/appointment.repository';
import { ConfigService } from '@nestjs/config';
import { SnsPublisherAdapter } from 'src/infraestructure/sns/sns-publisher.adapter';

@Module({
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    {
      provide: APPOINTMENT_REPOSITORY,
      useClass: DynamoDBAppointmentRepository,
    },
    ConfigService,
    SnsPublisherAdapter,
  ],
})
export class AppointmentsModule {}
