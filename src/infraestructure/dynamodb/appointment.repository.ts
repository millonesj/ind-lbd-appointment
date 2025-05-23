import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Appointment } from '../../domain/appointment.entity';
import { AppointmentRepositoryI } from '../../infraestructure/dynamodb/appointment.interface';

@Injectable()
export class DynamoDBAppointmentRepository implements AppointmentRepositoryI {
  private readonly DYNAMO_REGION: string;
  private readonly DYNAMO_CLIENT: DynamoDBClient;
  private readonly DOCUMENT_CLIENT: DynamoDBDocumentClient;
  private readonly tableName =
    process.env.APPOINTMENTS_TABLE || 'AppointmentsTable';

  constructor(private readonly configService: ConfigService) {
    this.DYNAMO_REGION = this.configService.get<string>('dynamoDB.region');
    this.DYNAMO_CLIENT = new DynamoDBClient({
      region: this.DYNAMO_REGION,
    });

    this.DOCUMENT_CLIENT = DynamoDBDocumentClient.from(this.DYNAMO_CLIENT, {
      marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
      },
    });
  }

  async save(appointment: Appointment): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        id: appointment.id,
        insuredId: appointment.insuredId,
        scheduleId: appointment.scheduleId,
        countryISO: appointment.countryISO,
        status: appointment.status,
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
      },
    };

    const command = new PutCommand(params);
    await this.DOCUMENT_CLIENT.send(command);
  }

  async findById(id: string): Promise<Appointment | null> {
    const params = {
      TableName: this.tableName,
      Key: { id },
    };

    const command = new GetCommand(params);
    const result = await this.DOCUMENT_CLIENT.send(command);

    if (!result.Item) return null;

    return new Appointment(
      result.Item.id,
      result.Item.insuredId,
      result.Item.scheduleId,
      result.Item.countryISO,
      result.Item.status,
      new Date(result.Item.createdAt),
      new Date(result.Item.updatedAt),
    );
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'insuredId-index',
      KeyConditionExpression: 'insuredId = :insuredId',
      ExpressionAttributeValues: {
        ':insuredId': insuredId,
      },
    });

    const result = await this.DOCUMENT_CLIENT.send(command);

    if (!result.Items) return [];

    return result.Items.map(
      (item) =>
        new Appointment(
          item.id,
          item.insuredId,
          item.scheduleId,
          item.countryISO,
          item.status,
          new Date(item.createdAt),
          new Date(item.updatedAt),
        ),
    );
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': new Date().toISOString(),
      },
    };

    const command = new UpdateCommand(params);
    await this.DOCUMENT_CLIENT.send(command);
  }

  async close(): Promise<void> {
    await this.DOCUMENT_CLIENT.destroy();
    await this.DYNAMO_CLIENT.destroy();
  }
}
