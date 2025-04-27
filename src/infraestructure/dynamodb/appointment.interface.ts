import { Appointment } from '../../domain/appointment.entity';

export const APPOINTMENT_REPOSITORY = 'APPOINTMENT_REPOSITORY';

export interface AppointmentRepositoryI {
  save(appointment: Appointment): Promise<void>;
  findById(id: string): Promise<Appointment | null>;
}
