import { PublishCommand } from '@aws-sdk/client-sns';
import { Appointment } from 'src/domain/appointment.entity';
import { SnsPublisherI } from './sns-publisher.interface';
import { snsClient } from './sns-client';

export class SnsPublisherAdapter implements SnsPublisherI {
  private readonly topicArn = process.env.SNS_TOPIC_ARN || '';

  async publish(appointment: Appointment): Promise<void> {
    try {
      const messageAttributes = {
        countryISO: {
          DataType: 'String',
          StringValue: appointment.countryISO,
        },
      };

      const command = new PublishCommand({
        TopicArn: this.topicArn,
        Message: JSON.stringify(appointment),
        MessageAttributes: messageAttributes,
      });

      const response = await snsClient.send(command);

      console.log('Mensaje publicado con ID:', response.MessageId);
      // Puedes registrar el response.$metadata para debugging
    } catch (error) {
      console.error('Error al publicar en SNS:', error);
      throw error; // Propaga el error para que el caller lo maneje
    }
  }
}
