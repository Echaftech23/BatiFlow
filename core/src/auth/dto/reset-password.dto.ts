import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import {
  PASSWORD_STRENGTH_MESSAGE,
  PASSWORD_STRENGTH_REGEX,
} from '../auth.constants';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\d{4}$/, { message: 'Code must be exactly 4 digits' })
  code: string;

  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_STRENGTH_REGEX, { message: PASSWORD_STRENGTH_MESSAGE })
  password: string;
}
