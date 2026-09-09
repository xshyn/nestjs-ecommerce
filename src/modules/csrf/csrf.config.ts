import { ForbiddenException } from '@nestjs/common';
import { createHash } from 'crypto';
import { doubleCsrf } from 'csrf-csrf';

export const CSRF_COOKIE_NAME =
  process.env.NODE_ENV === 'production' ? '__Host-csrf' : 'csrf';

export const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => {
    return process.env.CSRF_SECRET!;
  },

  getSessionIdentifier: (req) => {
    const refresh = req.cookies?.refresh;

    if (!refresh) throw new ForbiddenException();

    return createHash('sha256').update(refresh).digest('hex');
  },

  cookieName: CSRF_COOKIE_NAME,

  cookieOptions: {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  },

  getCsrfTokenFromRequest: (req) => {
    return req.headers['x-csrf-token'] as string;
  },
});
