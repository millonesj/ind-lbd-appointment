import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsUrl, Matches } from 'class-validator';

const allowedCountryISO = ['PE', 'CL'];
export class AppointmentCreateDto {
  @ApiProperty()
  @Matches(/^\d{5}$/, {
    message:
      'insuredId debe ser un número de 5 dígitos, incluidos los ceros iniciales.',
  })
  insuredId: string;

  @ApiProperty()
  @IsNumber()
  scheduleId: number;

  @ApiProperty()
  @IsEnum(allowedCountryISO, {
    message: `countryISO debe ser uno de los siguientes valores: ${allowedCountryISO.join(
      ', ',
    )}`,
  })
  countryISO: 'PE' | 'CL';
}
