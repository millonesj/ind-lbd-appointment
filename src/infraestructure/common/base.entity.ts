import {
  BaseEntity as BaseEntityTypeorm,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
export abstract class BaseEntity extends BaseEntityTypeorm {
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;
}
