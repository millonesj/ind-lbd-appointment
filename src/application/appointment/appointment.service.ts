import { Inject, Injectable } from '@nestjs/common';
import { Appointment } from 'src/domain/appointment.entity';
import {
  APPOINTMENT_REPOSITORY,
  AppointmentRepositoryI,
} from 'src/infraestructure/dynamodb/appointment.interface';
import { v4 as uuidv4 } from 'uuid';

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
  ) {}

  async execute(dto: CreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment(
      uuidv4(),
      dto.insuredId,
      dto.scheduleId,
      dto.countryISO,
    );
    await this.appointmentRepository.save(appointment);
    return appointment;
  }
}
