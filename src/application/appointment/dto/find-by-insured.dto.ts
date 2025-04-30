import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class FindByInsuredDto {
  @ApiProperty()
  @Matches(/^\d{5}$/, {
    message: 'insuredId must be a 5-digit number, including leading zeros',
  })
  insuredId: string;
}
