// services/publishAppointment.ts
import { PublishCommand } from '@aws-sdk/client-sns';
import { snsClient } from './snsClient';

interface AppointmentMessage {
  id: string;
  insuredId: string;
  scheduleId: number;
  countryISO: 'PE' | 'CL';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export const publishAppointment = async (
  appointment: AppointmentMessage,
): Promise<void> => {
  const topicArn = process.env.SNS_TOPIC_ARN;

  if (!topicArn) {
    throw new Error(
      'SNS_TOPIC_ARN no está definido en las variables de entorno.',
    );
  }

  const messageAttributes = {
    countryISO: {
      DataType: 'String',
      StringValue: appointment.countryISO,
    },
  };

  const command = new PublishCommand({
    TopicArn: topicArn,
    Message: JSON.stringify(appointment),
    MessageAttributes: messageAttributes,
  });

  try {
    const response = await snsClient.send(command);
    console.log('Mensaje publicado en SNS:', response.MessageId);
  } catch (error) {
    console.error('Error al publicar en SNS:', error);
    throw error;
  }
};
