import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  requestOKAppointment,
  invalidRequestAppointmentParamInvalidCountry,
  invalidRequestAppointmentAllParamInvalid,
} from '../mocks/request/appointment-create/request-appointment-create';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../../src/app.module';
import { APPOINTMENT_REPOSITORY } from '../../src/infraestructure/dynamodb/appointment.interface';
import { DynamoDBAppointmentRepository } from '../../src/infraestructure/dynamodb/appointment.repository';
import { Connection } from 'typeorm';

describe('AppController SUCCESS (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let HISTORY_SERVICE_URL: string;
  let dynamoRepository: DynamoDBAppointmentRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    configService = app.get<ConfigService>(ConfigService);
    HISTORY_SERVICE_URL = configService.get<string>('services.history');

    app.useGlobalPipes(new ValidationPipe());

    dynamoRepository = moduleFixture.get<DynamoDBAppointmentRepository>(
      APPOINTMENT_REPOSITORY,
    );

    await app.init();
  });

  afterAll(async () => {
    try {
      await dynamoRepository.close();
    } catch (err) {
      console.error('Error closing DynamoDB client:', err);
    }

    try {
      const connection = app.get(Connection);
      await connection.close();
    } catch (err) {
      console.error('Error closing TypeORM connection:', err);
    }

    await app.close();
  });

  it('When an appointment is created successfull', async () => {
    const response = await request(app.getHttpServer())
      .post('/appointments')
      .send(requestOKAppointment);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.stringMatching(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        ),
        insuredId: expect.any(String),
        scheduleId: expect.any(Number),
        countryISO: 'PE',
        status: 'pending',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );

    expect(() => new Date(response.body.createdAt).toISOString()).not.toThrow();
    expect(() => new Date(response.body.updatedAt).toISOString()).not.toThrow();
  });

  it('should return 400 for invalid countryISO', async () => {
    const response = await request(app.getHttpServer())
      .post('/appointments')
      .send(invalidRequestAppointmentParamInvalidCountry);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body).toHaveProperty('error', 'Bad Request');
    expect(response.body.message).toContain(
      'countryISO debe ser uno de los siguientes valores: PE, CL',
    );
  });

  it('should return 400 when multiple fields are invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/appointments')
      .send(invalidRequestAppointmentAllParamInvalid);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body).toHaveProperty('error', 'Bad Request');
    expect(response.body.message).toContain(
      'insuredId debe ser un número de 5 dígitos, incluidos los ceros iniciales.',
    );
    expect(response.body.message).toContain('scheduleId debería ser un número');
    expect(response.body.message).toContain(
      'countryISO debe ser uno de los siguientes valores: PE, CL',
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
