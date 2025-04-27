import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppointmentService } from 'src/application/appointment/appointment.service';
import { AppointmentCreateDto } from 'src/application/appointment/dto/appointment.create';
import { Appointment } from 'src/domain/appointment.entity';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new appointment' })
  @ApiResponse({ status: 201, description: 'successfull created' })
  async create(
    @Body()
    appointmentCreateDto: AppointmentCreateDto,
  ): Promise<Appointment> {
    return this.appointmentService.create(appointmentCreateDto);
  }
}
