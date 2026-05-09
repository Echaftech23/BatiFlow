import { IsEmail, IsString, Matches } from 'class-validator';

export class VerifyPasswordResetDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\d{4}$/, { message: 'Code must be exactly 4 digits' })
  code: string;
}
