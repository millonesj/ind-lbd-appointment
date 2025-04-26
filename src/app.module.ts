import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './presentation/app.controller';
import { AppService } from './application/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './infraestructure/config/configuration';
import { LoggingMiddleware } from './infraestructure/logger/logging.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './infraestructure/config/type-orm-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule],
      useFactory: async () => typeOrmConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
