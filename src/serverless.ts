import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Handler, Context, Callback } from 'aws-lambda';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppointmentService } from './application/appointment/appointment.service';

let server: Handler;
const logger = new Logger('AppointmentLambdaHandler');

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (event.httpMethod) {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
  } else if (event.Records && event.Records[0].eventSource === 'aws:sqs') {
    const app = await NestFactory.createApplicationContext(AppModule);
    const appointmentService = app.get(AppointmentService);
    for (const record of event.Records) {
      logger.log('EventHandlerService.handleEvent', record.body);
      try {
        const message = JSON.parse(record.body);
        const appointmentConfirmation =
          message?.detail?.appointmentConfirmation;
        logger.log('Processing SQS message');

        await appointmentService.updateAppointmentStatus(
          appointmentConfirmation.id,
          appointmentConfirmation.status,
        );

        logger.log(`Appointment ${message.appointmentId} updated to completed`);
      } catch (error) {
        logger.error('Error processing SQS message:', error);
        throw error;
      }
    }
  }
};
