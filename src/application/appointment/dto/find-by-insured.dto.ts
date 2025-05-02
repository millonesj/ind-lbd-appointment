import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class FindByInsuredDto {
  @ApiProperty()
  @Matches(/^\d{5}$/, {
    message:
      'insuredId debe ser un número de 5 dígitos, incluidos los ceros iniciales.',
  })
  insuredId: string;
}
