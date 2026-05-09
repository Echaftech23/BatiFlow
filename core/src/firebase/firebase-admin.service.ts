import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private app: admin.app.App | null = null;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const projectId = this.config.get<string>('FIREBASE_PROJECT_ID')?.trim();
    const clientEmail = this.config
      .get<string>('FIREBASE_CLIENT_EMAIL')
      ?.trim();
    let privateKey = this.config.get<string>('FIREBASE_PRIVATE_KEY')?.trim();
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn(
        'Firebase Admin credentials missing; POST /auth/firebase will be unavailable until FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set.',
      );
      return;
    }

    try {
      if (!admin.apps.length) {
        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      } else {
        this.app = admin.app();
      }
      this.logger.log('Firebase Admin initialized');
    } catch (err) {
      this.logger.error(
        `Firebase Admin failed to initialize: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  isConfigured(): boolean {
    return this.app !== null;
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    if (!this.app) {
      throw new ServiceUnavailableException(
        'Firebase Admin is not configured on this server',
      );
    }
    return admin.auth(this.app).verifyIdToken(idToken);
  }
}
