import { NextResponse } from 'next/server';
import { isGoogleConfigured } from '@/lib/auth';

/**
 * Lightweight public config so client screens can adapt to whether real
 * integrations are wired up, without exposing any secret values.
 */
export async function GET() {
  const key = process.env.OPENAI_API_KEY;
  return NextResponse.json({
    googleConfigured: isGoogleConfigured,
    openaiConfigured: Boolean(key && key !== 'placeholder' && key.startsWith('sk-')),
  });
}
