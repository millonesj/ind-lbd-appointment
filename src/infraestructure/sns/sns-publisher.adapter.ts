import { PublishCommand } from '@aws-sdk/client-sns';
import {
  AppointmentI,
  CountryISOI,
  SnsPublisherI,
} from './sns-publisher.interface';
import { snsClient } from './sns-client';
import { Logger } from '@nestjs/common';

export class SnsPublisherAdapter implements SnsPublisherI {
  private readonly logger = new Logger(SnsPublisherAdapter.name);
  private readonly topicArn = process.env.SNS_TOPIC_ARN || '';

  async publish(
    appointment: AppointmentI,
    countryISO: CountryISOI,
  ): Promise<void> {
    try {
      const messageAttributes = {
        countryISO: {
          DataType: 'String',
          StringValue: countryISO,
        },
      };

      const command = new PublishCommand({
        TopicArn: this.topicArn,
        Message: JSON.stringify(appointment),
        MessageAttributes: messageAttributes,
      });

      const response = await snsClient.send(command);

      this.logger.log(`Mensaje publicado con ID: ${response.MessageId}`);
    } catch (error) {
      this.logger.error(`Error al publicar en SNS: ${error?.message}`);
      throw error; // Propaga el error para que el caller lo maneje
    }
  }
}
