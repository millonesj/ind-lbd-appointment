export type AppointmentStatus = 'pending' | 'completed' | 'failed';

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly insuredId: string,
    public readonly scheduleId: number,
    public readonly countryISO: 'PE' | 'CL',
    public status: AppointmentStatus = 'pending',
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  // setAsCompleted() {
  //   this.status = 'completed';
  //   this.updatedAt = new Date();
  // }

  // setAsFailed() {
  //   this.status = 'failed';
  //   this.updatedAt = new Date();
  // }
}
