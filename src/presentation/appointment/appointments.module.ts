import { Logger, Module } from '@nestjs/common';
import { AppointmentController } from '../appointment.controller';
import { AppointmentService } from '../../application/appointment/appointment.service';
import { APPOINTMENT_REPOSITORY } from '../../infraestructure/dynamodb/appointment.interface';
import { DynamoDBAppointmentRepository } from '../../infraestructure/dynamodb/appointment.repository';
import { ConfigService } from '@nestjs/config';
import { SnsPublisherAdapter } from '../../infraestructure/sns/sns-publisher.adapter';

@Module({
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    {
      provide: APPOINTMENT_REPOSITORY,
      useClass: DynamoDBAppointmentRepository,
    },
    ConfigService,
    Logger,
    SnsPublisherAdapter,
  ],
})
export class AppointmentsModule {}
