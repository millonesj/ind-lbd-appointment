import { Controller, Post, Body, Response, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AppointmentService } from '../application/appointment/appointment.service';
import { FindByInsuredDto } from '../application/appointment/dto/find-by-insured.dto';
import { AppointmentCreateDto } from '../application/appointment/dto/appointment.create';
import { Appointment } from '../domain/appointment.entity';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new appointment',
    description:
      'Creates a new appointment with the provided details. Both insuredId and countryISO are validated.',
  })
  @ApiBody({
    type: AppointmentCreateDto,
    description: 'Appointment creation payload',
    examples: {
      valid: {
        summary: 'Valid payload example',
        value: {
          insuredId: '00001',
          scheduleId: 56432,
          countryISO: 'PE',
        },
      },
      invalid: {
        summary: 'Invalid payload example',
        value: {
          insuredId: '123',
          scheduleId: 'not a number',
          countryISO: 'US',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Appointment successfully created',
    type: Appointment,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    content: {
      'application/json': {
        examples: {
          insuredIdError: {
            value: {
              statusCode: 400,
              message: [
                'insuredId debe ser un número de 5 dígitos, incluidos los ceros iniciales.',
              ],
              error: 'Bad Request',
            },
          },
          countryIsoError: {
            value: {
              statusCode: 400,
              message: [
                'countryISO debe ser uno de los siguientes valores: PE, CL',
              ],
              error: 'Bad Request',
            },
          },
          bothErrors: {
            value: {
              statusCode: 400,
              message: [
                'insuredId debe ser un número de 5 dígitos, incluidos los ceros iniciales.',
                'countryISO debe ser uno de los siguientes valores: PE, CL',
              ],
              error: 'Bad Request',
            },
          },
        },
      },
    },
  })
  async create(
    @Body()
    appointmentCreateDto: AppointmentCreateDto,
  ): Promise<Appointment> {
    return this.appointmentService.create(appointmentCreateDto);
  }

  @Get('insured/:insuredId')
  @ApiOperation({
    summary: 'Get appointments by insuredId',
    description:
      'Retrieves all appointments for a specific insuredId. The insuredId must be a 5-digit number.',
  })
  @ApiParam({
    name: 'insuredId',
    description: '5-digit insured ID',
    example: '00123',
    required: true,
  })
  @ApiOkResponse({
    description: 'List of appointments found',
    content: {
      'application/json': {
        examples: {
          singleAppointment: {
            value: [
              {
                id: '1955ad6a-61d9-4a72-aa9d-b3624f92871c',
                insuredId: '00001',
                scheduleId: 10,
                countryISO: 'PE',
                status: 'pending',
                createdAt: '2025-04-27T06:13:26.657Z',
                updatedAt: '2025-04-27T06:13:26.657Z',
              },
            ],
          },
          multipleAppointments: {
            value: [
              {
                id: '1955ad6a-61d9-4a72-aa9d-b3624f92871c',
                insuredId: '00001',
                scheduleId: 10,
                countryISO: 'PE',
                status: 'pending',
                createdAt: '2025-04-27T06:13:26.657Z',
                updatedAt: '2025-04-27T06:13:26.657Z',
              },
              {
                id: '2b66c8a2-3e1f-4b5d-8c9a-7d8b6e5f4c3d',
                insuredId: '00001',
                scheduleId: 15,
                countryISO: 'PE',
                status: 'completed',
                createdAt: '2025-03-15T10:20:30.000Z',
                updatedAt: '2025-03-16T08:15:45.000Z',
              },
            ],
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid insuredId format',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: [
            'insuredId debe ser un número de 5 dígitos, incluidos los ceros iniciales.',
          ],
          error: 'Bad Request',
        },
      },
    },
  })
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
