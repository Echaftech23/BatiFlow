import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';
import { Model } from 'mongoose';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { UsersService } from '../users/users.service';
import type { RegisterDto } from './dto/register.dto';
import type { ResendVerificationDto } from './dto/resend-verification.dto';
import type { VerifyEmailDto } from './dto/verify-email.dto';
import type { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import {
  OTP_PURPOSE_REGISTER,
  OtpChallenge,
  OtpChallengeDocument,
} from './schemas/otp-challenge.schema';
import { OtpSendLog, OtpSendLogDocument } from './schemas/otp-send-log.schema';
import { Resend } from 'resend';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly resend: Resend | null;

  constructor(
    private readonly usersService: UsersService,
    private readonly firebaseAdmin: FirebaseAdminService,
    @InjectModel(OtpChallenge.name)
    private readonly otpModel: Model<OtpChallengeDocument>,
    @InjectModel(OtpSendLog.name)
    private readonly otpSendLogModel: Model<OtpSendLogDocument>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    const key = this.config.get<string>('RESEND_API_KEY');
    this.resend = key ? new Resend(key) : null;
  }

  async register(dto: RegisterDto): Promise<void> {
    const email = dto.email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.usersService.createOrUpdatePendingRegistration({
      email,
      passwordHash,
      profile: dto.profile,
    });
    await this.issueRegistrationOtp(email);

    this.logger.log(`Registration OTP issued for user ${String(user._id)}`);
  }

  async resendVerification(dto: ResendVerificationDto): Promise<void> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(email);
    if (!user || user.emailVerified) {
      return;
    }
    await this.issueRegistrationOtp(email);
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{
    accessToken: string;
    user: { id: string; email: string; emailVerified: boolean };
  }> {
    const email = dto.email.toLowerCase().trim();
    const maxAttempts = this.config.get<number>('OTP_MAX_ATTEMPTS', 5);

    const challenge = await this.otpModel
      .findOne({ email, purpose: OTP_PURPOSE_REGISTER })
      .exec();

    if (!challenge || challenge.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    if (challenge.attempts >= maxAttempts) {
      throw new UnauthorizedException('Too many attempts; request a new code');
    }

    const ok = this.verifyOtpHash(dto.code, challenge.codeHash);
    if (!ok) {
      challenge.attempts += 1;
      await challenge.save();
      throw new UnauthorizedException('Invalid verification code');
    }

    const user = await this.usersService.markEmailVerifiedByEmail(email);
    await this.otpModel.deleteOne({ _id: challenge._id }).exec();

    const accessToken = await this.signAccessToken({
      sub: String(user._id),
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: String(user._id),
        email: user.email,
        emailVerified: user.emailVerified,
      },
    };
  }

  async login(dto: LoginDto): Promise<{
    accessToken: string;
    user: { id: string; email: string; emailVerified: boolean };
  }> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmailWithPasswordHash(email);

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.signAccessToken({
      sub: String(user._id),
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: String(user._id),
        email: user.email,
        emailVerified: user.emailVerified,
      },
    };
  }

  async signInWithFirebase(idToken: string): Promise<{
    accessToken: string;
    user: { id: string; email: string; emailVerified: boolean };
  }> {
    const decoded = await this.firebaseAdmin.verifyIdToken(idToken);
    const email = decoded.email?.toLowerCase().trim();
    if (!email) {
      throw new BadRequestException(
        'Firebase token is missing an email claim; ensure the provider returns email to Firebase Auth.',
      );
    }

    const user = await this.usersService.upsertFromFirebaseAuth({
      firebaseUid: decoded.uid,
      email,
    });

    const accessToken = await this.signAccessToken({
      sub: String(user._id),
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: String(user._id),
        email: user.email,
        emailVerified: user.emailVerified,
      },
    };
  }

  private async signAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  private generateOtpCode(): string {
    const n = crypto.randomInt(0, 1_000_000);
    return n.toString().padStart(6, '0');
  }

  private hashOtp(code: string): string {
    const pepper = this.config.getOrThrow<string>('OTP_PEPPER');
    return crypto
      .createHash('sha256')
      .update(`${code}:${pepper}`, 'utf8')
      .digest('hex');
  }

  private verifyOtpHash(code: string, storedHash: string): boolean {
    const a = Buffer.from(this.hashOtp(code), 'hex');
    const b = Buffer.from(storedHash, 'hex');
    if (a.length !== b.length) {
      return false;
    }
    return crypto.timingSafeEqual(a, b);
  }

  private async assertUnderSendRate(email: string, maxPerHour: number) {
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const count = await this.otpSendLogModel
      .countDocuments({
        email,
        createdAt: { $gte: since },
      })
      .exec();
    if (count >= maxPerHour) {
      throw new ConflictException(
        'Too many verification emails sent; try again later',
      );
    }
  }

  private async sendRegistrationOtpEmail(
    to: string,
    code: string,
    ttlMinutes: number,
  ): Promise<void> {
    const from = this.config.getOrThrow<string>('RESEND_FROM_EMAIL');

    if (!this.resend) {
      this.logger.warn(
        'RESEND_API_KEY is not set; OTP email not sent (development)',
      );
      return;
    }

    const { error } = await this.resend.emails.send({
      from,
      to,
      subject: 'BatiFlow — Vérifiez votre adresse e-mail',
      text: [
        'Bonjour,',
        '',
        `Votre code de vérification BatiFlow est : ${code}`,
        `Il expire dans ${String(ttlMinutes)} minutes.`,
        '',
        'Si vous n’avez pas demandé ce code, ignorez ce message.',
      ].join('\n'),
    });

    if (error) {
      this.logger.error(`Resend error: ${JSON.stringify(error)}`);
      throw new BadRequestException('Could not send verification email');
    }
  }

  private async issueRegistrationOtp(email: string): Promise<void> {
    const maxSends = this.config.get<number>('OTP_MAX_SENDS_PER_HOUR', 5);
    const ttlMinutes = this.config.get<number>('OTP_TTL_MINUTES', 15);
    await this.assertUnderSendRate(email, maxSends);

    const code = this.generateOtpCode();
    const codeHash = this.hashOtp(code);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await this.otpModel
      .findOneAndUpdate(
        { email, purpose: OTP_PURPOSE_REGISTER },
        {
          $set: {
            codeHash,
            expiresAt,
            attempts: 0,
          },
        },
        { upsert: true, new: true },
      )
      .exec();

    const sendLog = await this.otpSendLogModel.create({ email });
    try {
      await this.sendRegistrationOtpEmail(email, code, ttlMinutes);
    } catch (err) {
      await this.otpSendLogModel.deleteOne({ _id: sendLog._id }).exec();
      await this.otpModel
        .deleteOne({ email, purpose: OTP_PURPOSE_REGISTER })
        .exec();
      throw err;
    }
  }
}
