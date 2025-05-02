import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { DynamoDBAppointmentRepository } from '../../src/infraestructure/dynamodb/appointment.repository';
import { Connection } from 'typeorm';
import { APPOINTMENT_REPOSITORY } from '../../src/infraestructure/dynamodb/appointment.interface';
import {
  insuredIdExist,
  insuredIdWithNoAppointments,
  invalidInsuredId,
} from '../mocks/request/appointments-by-insured/request-appointments-by-insured';

describe('Appointments by Insured (e2e)', () => {
  let app: INestApplication;
  let dynamoRepository: DynamoDBAppointmentRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  describe('GET /appointments/insured/:insuredId', () => {
    it('should return 200 and a list of appointments for a valid insuredId', async () => {
      const response = await request(app.getHttpServer()).get(
        `/appointments/insured/${insuredIdExist}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);

      // check new appointment
      if (response.body.length > 0) {
        expect(response.body[0]).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            insuredId: insuredIdExist,
            scheduleId: expect.any(Number),
            countryISO: expect.stringMatching(/^PE|CL$/),
            status: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        );
      }
    });

    it('should return 400 if insuredId is invalid (not 5 digits)', async () => {
      const response = await request(app.getHttpServer()).get(
        `/appointments/insured/${invalidInsuredId}`,
      );

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 400,
          error: 'Bad Request',
          message: expect.arrayContaining([
            'insuredId debe ser un número de 5 dígitos, incluidos los ceros iniciales.',
          ]),
        }),
      );
    });

    it('should return empty array if insuredId has no appointments', async () => {
      const response = await request(app.getHttpServer()).get(
        `/appointments/insured/${insuredIdWithNoAppointments}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
