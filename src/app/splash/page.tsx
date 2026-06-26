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
    <div className="flex flex-col items-center justify-between min-h-screen max-w-[390px] mx-auto bg-[#fbfbfa] px-6 py-14">
      {/* Top disclaimer */}
      <p className="text-xs text-[#5f5b57] text-center">
        Estudo sem vínculo oficial com a marca
      </p>

      {/* Center content */}
      <div className="flex flex-col items-center gap-3">
        <LogoSvg width={190} height={102} aria-label="Notion Pulse" />
        <p className="text-xs text-[#5f5b57] text-center">
          Checklist por comando de voz
        </p>
      </div>

      {/* Bottom credit */}
      <p className="text-xs text-[#5f5b57] text-center">
        Feito com amor por ensinar por{' '}
        <span className="font-semibold text-black">Design Boost</span>
      </p>
    </div>
  );
}
