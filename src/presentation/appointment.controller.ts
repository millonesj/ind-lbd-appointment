import { Controller, Post, Body, Response, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppointmentService } from 'src/application/appointment/appointment.service';
import { FindByInsuredDto } from 'src/application/appointment/dto/find-by-insured.dto';
import { AppointmentCreateDto } from 'src/application/appointment/dto/appointment.create';
import { Appointment } from 'src/domain/appointment.entity';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new appointment' })
  @ApiResponse({ status: 201, description: 'Successfully created' })
  async create(
    @Body()
    appointmentCreateDto: AppointmentCreateDto,
  ): Promise<Appointment> {
    return this.appointmentService.create(appointmentCreateDto);
  }

  @Get('insured/:insuredId')
  @ApiOperation({ summary: 'Get appointments by insuredId' })
  async findByInsuredId(
    @Param()
    findByInsuredDto: FindByInsuredDto,
    @Response() res,
  ) {
    const providers = await this.appointmentService.findByInsuredId(
      findByInsuredDto,
    );

    return res.status(200).send(providers);
  }
}
