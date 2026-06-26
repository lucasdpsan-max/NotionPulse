import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const googleId = process.env.AUTH_GOOGLE_ID;
const googleSecret = process.env.AUTH_GOOGLE_SECRET;

/**
 * Google is only registered when real credentials are present. Until you paste
 * them into `.env.local`, the app still works through the local demo user
 * (see `getCurrentUserId` in `src/lib/tasks.ts`).
 */
export const isGoogleConfigured = Boolean(
  googleId && googleSecret && !googleId.includes('placeholder'),
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/onboarding',
  },
  providers: isGoogleConfigured
    ? [Google({ clientId: googleId, clientSecret: googleSecret })]
    : [],
  callbacks: {
    // Keep redirects inside the app and default authenticated users to /home.
    redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/home`;
    },
  },
});
