import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import config from './configuration';
const { database } = config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: database.host,
  port: +database.port,
  username: database.username,
  password: database.password,
  database: database.database,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: database.synchronize,
  logging: database.logging,
  namingStrategy: new SnakeNamingStrategy(),
  migrations: ['dist/infraestructure/migrations/**/*{.ts,.js}'],
  migrationsRun: database.migrationsRun,
};
