import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsUrl, Matches } from 'class-validator';

export class AppointmentCreateDto {
  @ApiProperty()
  @Matches(/^\d{5}$/, {
    message: 'insuredId must be a 5-digit number, including leading zeros',
  })
  insuredId: string;

  @ApiProperty()
  @IsNumber()
  scheduleId: number;

  @ApiProperty()
  @IsEnum(['PE', 'CL'])
  countryISO: 'PE' | 'CL';
}
