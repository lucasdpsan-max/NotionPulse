'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoSvg from '@/assets/logo.svg';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen max-w-[390px] mx-auto bg-[#F5F5F0] px-6 py-10">
      {/* Top disclaimer */}
      <p className="text-xs text-gray-400 text-center mt-4">
        Estudo sem vínculo oficial com a marca
      </p>

      {/* Center content */}
      <div className="flex flex-col items-center gap-4">
        <LogoSvg width={96} height={96} aria-label="NotionPulse" />
        <h1 className="text-3xl font-bold text-[#0D2137] tracking-tight">
          NotionPulse
        </h1>
        <p className="text-sm text-gray-500 text-center">
          Checklist por comando de voz
        </p>
      </div>

      {/* Bottom credit */}
      <p className="text-xs text-gray-400 text-center mb-4">
        Feito com amor por ensinar por{' '}
        <span className="font-bold text-gray-600">Design Boost</span>
      </p>
    </div>
  );
}
