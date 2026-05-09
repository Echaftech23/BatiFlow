import {
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

const PHONE_REGEX = /^06\d{8}$/;
const ZIP_REGEX = /^\d{5}$/;

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  profession?: string;

  @IsOptional()
  @IsString()
  @Matches(PHONE_REGEX, {
    message:
      'Le numéro doit commencer par 06 et contenir exactement 10 chiffres',
  })
  @Length(10, 10, { message: 'Le numéro doit contenir exactement 10 chiffres' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  zone?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  address?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  city?: string;

  @IsOptional()
  @IsString()
  @Matches(ZIP_REGEX, { message: 'Code postal à 5 chiffres' })
  zip?: string;
}
