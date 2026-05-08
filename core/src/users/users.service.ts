import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument, UserProfile } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByIdSafe(id: string) {
    const user = await this.userModel.findById(id).lean().exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmailWithPasswordHash(
    email: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select('+passwordHash')
      .exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async createOrUpdatePendingRegistration(data: {
    email: string;
    passwordHash: string;
    profile?: UpdateProfileDto;
  }): Promise<UserDocument> {
    const email = data.email.toLowerCase().trim();
    const existing = await this.userModel.findOne({ email }).exec();

    if (existing?.emailVerified) {
      throw new ConflictException('Email already registered');
    }

    const profile = this.mergeProfile(existing?.profile, data.profile);

    if (existing) {
      existing.passwordHash = data.passwordHash;
      if (profile !== undefined) {
        existing.profile = profile;
      }
      return existing.save();
    }

    return this.userModel.create({
      email,
      passwordHash: data.passwordHash,
      emailVerified: false,
      profile,
    });
  }

  async markEmailVerifiedByEmail(email: string): Promise<{
    _id: unknown;
    email: string;
    emailVerified: boolean;
  }> {
    const normalized = email.toLowerCase().trim();
    const user = await this.userModel
      .findOneAndUpdate(
        { email: normalized, emailVerified: false },
        { emailVerified: true },
        { new: true },
      )
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('User not found or already verified');
    }

    return {
      _id: user._id,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }

  async updatePasswordHashForVerifiedEmail(
    email: string,
    passwordHash: string,
  ): Promise<void> {
    const normalized = email.toLowerCase().trim();
    const result = await this.userModel
      .updateOne(
        { email: normalized, emailVerified: true },
        { $set: { passwordHash } },
      )
      .exec();
    if (result.matchedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  private mergeProfile(
    existing: UserProfile | undefined,
    patch: UpdateProfileDto | undefined,
  ): UserProfile | undefined {
    if (!patch) {
      return existing;
    }
    const next: UserProfile = { ...existing };
    (Object.keys(patch) as (keyof UpdateProfileDto)[]).forEach((key) => {
      const value = patch[key];
      if (value !== undefined) {
        next[key] = value;
      }
    });
    return Object.keys(next).length > 0 ? next : existing;
  }

  async upsertFromFirebaseAuth(data: {
    firebaseUid: string;
    email: string;
  }): Promise<{
    _id: unknown;
    email: string;
    emailVerified: boolean;
  }> {
    const email = data.email.toLowerCase().trim();

    const byUid = await this.userModel
      .findOne({ firebaseUid: data.firebaseUid })
      .exec();
    if (byUid) {
      const conflict = await this.userModel
        .findOne({ email, _id: { $ne: byUid._id } })
        .exec();
      if (conflict) {
        throw new ConflictException('Email already in use');
      }
      if (byUid.email !== email) {
        byUid.email = email;
      }
      byUid.emailVerified = true;
      await byUid.save();
      return {
        _id: byUid._id,
        email: byUid.email,
        emailVerified: byUid.emailVerified,
      };
    }

    const byEmail = await this.userModel.findOne({ email }).exec();
    if (byEmail) {
      if (byEmail.firebaseUid && byEmail.firebaseUid !== data.firebaseUid) {
        throw new ConflictException(
          'This email is already linked to another account',
        );
      }
      byEmail.firebaseUid = data.firebaseUid;
      byEmail.emailVerified = true;
      await byEmail.save();
      return {
        _id: byEmail._id,
        email: byEmail.email,
        emailVerified: byEmail.emailVerified,
      };
    }

    const created = await this.userModel.create({
      email,
      firebaseUid: data.firebaseUid,
      emailVerified: true,
    });

    return {
      _id: created._id,
      email: created.email,
      emailVerified: created.emailVerified,
    };
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const $set: Record<string, string> = {};
    (Object.keys(dto) as (keyof UpdateProfileDto)[]).forEach((key) => {
      const value = dto[key];
      if (value !== undefined) {
        $set[`profile.${String(key)}`] = value;
      }
    });

    if (Object.keys($set).length === 0) {
      return this.findByIdSafe(id);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, { $set }, { new: true })
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
