import { PublishCommand } from '@aws-sdk/client-sns';
import { Appointment } from 'src/domain/appointment.entity';
import { SnsPublisherI } from './sns-publisher.interface';
import { snsClient } from './sns-client';

export class SnsPublisherAdapter implements SnsPublisherI {
  private readonly topicArn = process.env.SNS_TOPIC_ARN || '';

  async publish(appointment: Appointment): Promise<void> {
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

    await snsClient.send(command);
  }
}
