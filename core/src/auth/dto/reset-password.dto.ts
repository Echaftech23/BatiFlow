import { IsString, Matches, MinLength } from 'class-validator';
import {
  PASSWORD_STRENGTH_MESSAGE,
  PASSWORD_STRENGTH_REGEX,
} from '../auth.constants';

export class ResetPasswordDto {
  @IsString()
  @MinLength(40)
  token: string;

  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_STRENGTH_REGEX, { message: PASSWORD_STRENGTH_MESSAGE })
  password: string;
}
