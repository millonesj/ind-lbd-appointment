import { Appointment } from 'src/domain/appointment.entity';

export interface SnsPublisherI {
  publish(appointment: Appointment): Promise<void>;
}
