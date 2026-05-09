import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';

const PHONE_REGEX = /^06\d{8}$/;
const ZIP_REGEX = /^\d{5}$/;

export class ClientAppointmentDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @Matches(PHONE_REGEX, {
    message:
      'Le numéro doit commencer par 06 et contenir exactement 10 chiffres',
  })
  @Length(10, 10, { message: 'Le numéro doit contenir exactement 10 chiffres' })
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  address: string;

  @IsString()
  @Matches(ZIP_REGEX, { message: 'Code postal à 5 chiffres' })
  zip: string;

  @IsOptional()
  @IsString()
  city?: string;
}

export class CreateAppointmentDto {
  @ValidateNested()
  @Type(() => ClientAppointmentDto)
  client: ClientAppointmentDto;

  @IsString()
  @MinLength(1)
  serviceLabel: string;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
