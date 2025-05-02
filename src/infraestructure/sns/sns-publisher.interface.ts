export interface SnsPublisherI {
  publish(appointment: AppointmentI, CountryISO): Promise<void>;
}

export interface AppointmentI {
  id: string;
  insuredId: string;
  scheduleId: number;
}

export type CountryISOI = 'PE' | 'CL';
