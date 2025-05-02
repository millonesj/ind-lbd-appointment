import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Matches } from 'class-validator';

const allowedCountryISO = ['PE', 'CL'];
export class AppointmentCreateDto {
  @ApiProperty()
  @Matches(/^\d{5}$/, {
    message:
      'insuredId debe ser un número de 5 dígitos, incluidos los ceros iniciales.',
  })
  insuredId: string;

  @ApiProperty()
  @IsNumber(
    {},
    {
      message: 'scheduleId debería ser un número',
    },
  )
  scheduleId: number;

  @ApiProperty()
  @IsEnum(allowedCountryISO, {
    message: `countryISO debe ser uno de los siguientes valores: ${allowedCountryISO.join(
      ', ',
    )}`,
  })
  countryISO: 'PE' | 'CL';
}
