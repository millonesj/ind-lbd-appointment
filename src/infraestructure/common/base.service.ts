import { Repository } from 'typeorm/repository/Repository';

export abstract class BaseService<T> {
  private readonly namespace: string;

  constructor(private readonly repository: Repository<T>) {
    this.namespace = this.constructor.name;
  }

  getNamespace(): string {
    return this.namespace;
  }
}
