import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  Appointment,
  AppointmentStatus,
} from '../../domain/appointment.entity';
import {
  APPOINTMENT_REPOSITORY,
  AppointmentRepositoryI,
} from '../../infraestructure/dynamodb/appointment.interface';
import { SnsPublisherAdapter } from '../../infraestructure/sns/sns-publisher.adapter';
import { v4 as uuidv4 } from 'uuid';
import { FindByInsuredDto } from './dto/find-by-insured.dto';
import { AppointmentI } from '../../infraestructure/sns/sns-publisher.interface';

export interface CreateAppointmentDTO {
  insuredId: string;
  scheduleId: number;
  countryISO: 'PE' | 'CL';
}

@Injectable()
export class AppointmentService {
  constructor(
    private readonly logger: Logger,
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

    await this.appointmentRepository.save(appointment);

    const appointmentSNS: AppointmentI = {
      id: appointment.id,
      insuredId: appointment.insuredId,
      scheduleId: appointment.scheduleId,
    };
    await this.snsPublisherAdapter.publish(appointmentSNS, dto.countryISO);
    return appointment;
  }

  async findByInsuredId({ insuredId }: FindByInsuredDto) {
    this.logger.log(`AppointmentService.findByInsuredId`, {
      start: true,
    });

    const response = await this.appointmentRepository.findByInsuredId(
      insuredId,
    );

    this.logger.log(`AppointmentService.findByInsuredId`, {
      countResponse: response?.length,
    });
    return response;
  }

  async updateAppointmentStatus(id: string, status: string): Promise<void> {
    this.logger.log(`Updating appointment ${id} to status ${status}`);

    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new Error(`Appointment with id ${id} not found`);
    }

    appointment.status = status as AppointmentStatus;
    appointment.updatedAt = new Date();

    await this.appointmentRepository.save(appointment);

    this.logger.log(`Appointment ${id} successfully updated to ${status}`);
  }
}
