import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
/** Partial client fields for PATCH; omit fields you do not change. */
export class ClientAppointmentPatchDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  zip?: string;
}

export class UpdateAppointmentDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ClientAppointmentPatchDto)
  client?: ClientAppointmentPatchDto;

  @IsOptional()
  @IsString()
  @MinLength(1)
  serviceLabel?: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
