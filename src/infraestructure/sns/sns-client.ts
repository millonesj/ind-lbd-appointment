import { SNSClient } from '@aws-sdk/client-sns';

const REGION = process.env.AWS_REGION || 'us-east-1'; // Reemplaza con tu región deseada

export const snsClient = new SNSClient({ region: REGION });
