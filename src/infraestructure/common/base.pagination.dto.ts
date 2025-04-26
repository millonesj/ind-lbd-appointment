import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Min } from 'class-validator';
import config from '../../infraestructure/config/configuration';

const { pagination } = config();

export enum OrderByEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export abstract class BasePaginationDto {
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    description: 'Pagination page size',
    required: false,
    example: 7,
  })
  limit?: number = parseInt(pagination.limit);

  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    description: 'Pagination page number',
    required: false,
    example: 1,
  })
  page?: number = 1;
}
