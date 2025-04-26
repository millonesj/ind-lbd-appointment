import { DataSource, QueryRunner } from 'typeorm';

export const startTransactionWithQueryRunner = async (
  dataSource: DataSource,
): Promise<QueryRunner> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  return queryRunner;
};
