import { Inject, Injectable } from '@nestjs/common';
import { Appointment } from 'src/domain/appointment.entity';
import {
  APPOINTMENT_REPOSITORY,
  AppointmentRepositoryI,
} from 'src/infraestructure/dynamodb/appointment.interface';
import { SnsPublisherAdapter } from 'src/infraestructure/sns/sns-publisher.adapter';
import { v4 as uuidv4 } from 'uuid';
import { publishAppointment } from '../publishAppointment';

export interface CreateAppointmentDTO {
  insuredId: string;
  scheduleId: number;
  countryISO: 'PE' | 'CL';
}

@Injectable()
export class AppointmentService {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: AppointmentRepositoryI,
    private readonly snsPublisherAdapter: SnsPublisherAdapter,
  ) {}

  async create(dto: CreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment(
      uuidv4(),
      dto.insuredId,
      dto.scheduleId,
      dto.countryISO,
    );

    const saved = await this.appointmentRepository.save(appointment);
    console.log('🚀 ~ :34 ~ AppointmentService ~ create ~ saved:', saved);
    await this.snsPublisherAdapter.publish(appointment);
    return appointment;
  }
}
