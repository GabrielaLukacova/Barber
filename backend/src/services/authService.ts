// backend/src/services/authService.ts
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

if (!ADMIN_PASSWORD_HASH) {
  console.warn(
    '[authService] WARNING: ADMIN_PASSWORD_HASH is not set in .env – login will always fail.',
  );
}

export class AuthService {
  async validateAdmin(
    username: string,
    password: string,
  ): Promise<{ username: string } | null> {
    // 1) username must match
    if (username !== ADMIN_USERNAME) {
      return null;
    }

    // 2) compare password with hash
    if (!ADMIN_PASSWORD_HASH) return null;

    const ok = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!ok) return null;

    return { username: ADMIN_USERNAME };
  }
}

export const authService = new AuthService();
