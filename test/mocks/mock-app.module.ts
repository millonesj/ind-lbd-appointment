import { AppController } from '../src/app.controller';
import { LoggerService } from '../src/services/logger/logger.service';
import { HttpService } from '../src/services/http/http.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/configuration';
import { CatalogService } from '../src/services/catalog/catalog.service';
import { DynamoService } from '../src/services/dynamo/dynamo.service';
import { MessageDynamoService } from '../src/services/message-dynamo/message-dynamo.service';
import { Module } from '@nestjs/common';
import { AesService } from '../src/services/aes/aes.service';
import { HistoryService } from '../src/services/history/history.service';
export const mockDynamo = {
  getOne: jest.fn(),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [
    LoggerService,
    HttpService,
    CatalogService,
    MessageDynamoService,
    AesService,
    HistoryService,
    {
      provide: DynamoService,
      useValue: mockDynamo,
    },
  ],
})
export class MockAppModule {}
