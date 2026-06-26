'use client';

import { useState, useEffect, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import IllustrationSvg from '@/assets/illustration.svg';
import Illustration1Svg from '@/assets/illustration-1.svg';
import Illustration2Svg from '@/assets/illustration-2.svg';

type IllustrationComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const steps: {
  bg: string;
  badge: string;
  title: string;
  subtitle: string;
  Illustration: IllustrationComponent;
}[] = [
  {
    bg: '#E8F0F7',
    badge: 'Pulse • Voice',
    title: 'Crie tarefas por comando de 🎤 voz',
    subtitle: 'Fale naturalmente e transforme suas ideias em tarefas.',
    Illustration: IllustrationSvg as IllustrationComponent,
  },
  {
    bg: '#F0EBF7',
    badge: 'Pulse • Share',
    title: 'Compartilhe tarefas com sua equipe 👥',
    subtitle: 'Planeje e colabore com outras pessoas em tempo real.',
    Illustration: Illustration1Svg as IllustrationComponent,
  },
  {
    bg: '#EBF5F0',
    badge: 'Pulse • Sync',
    title: 'Sincronize com sua agenda 📅',
    subtitle: 'Conecte seus compromissos e nunca perca um prazo.',
    Illustration: Illustration2Svg as IllustrationComponent,
  },
];

const STEP_DURATION = 4000;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const goToNext = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
      setProgressKey((k) => k + 1);
      setAnimating(false);
    }, 400);
  }, []);

  useEffect(() => {
    const interval = setInterval(goToNext, STEP_DURATION);
    return () => clearInterval(interval);
  }, [goToNext]);

  const step = steps[currentStep];
  const { Illustration } = step;

  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl: '/home' });
  };

  return (
    <div className="flex flex-col max-w-[390px] mx-auto min-h-screen bg-white">
      {/* Sliding top section */}
      <div
        className="flex-1 flex flex-col items-center px-6 pt-10 pb-6"
        style={{
          backgroundColor: step.bg,
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateX(-30px)' : 'translateX(0)',
          transition: 'opacity 0.4s ease, transform 0.4s ease, background-color 0.4s ease',
        }}
      >
        {/* Badge */}
        <div className="self-start mb-6">
          <span className="text-xs font-semibold bg-white/60 backdrop-blur-sm text-[#0D2137] px-3 py-1.5 rounded-full border border-white/40">
            {step.badge}
          </span>
        </div>

        {/* Illustration */}
        <div className="w-full flex justify-center mb-8">
          <Illustration
            width={280}
            height={220}
            className="max-w-full"
            aria-label="Illustration"
          />
        </div>

        {/* Text */}
        <div className="w-full text-left">
          <h1 className="text-2xl font-bold text-[#0D2137] leading-tight mb-3">
            {step.title}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            {step.subtitle}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mt-8">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentStep(i);
                setProgressKey((k) => k + 1);
              }}
              className="transition-all duration-300"
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-8 bg-[#0D2137]'
                    : 'w-2 bg-gray-300'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Progress bar fill */}
        <div className="w-full mt-4 h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            key={progressKey}
            className="h-full bg-[#0D2137] rounded-full"
            style={{
              animation: `fillProgress ${STEP_DURATION}ms linear forwards`,
            }}
          />
        </div>
      </div>

      {/* Fixed bottom section */}
      <div className="bg-white px-6 py-8 flex flex-col gap-4">
        {/* Terms */}
        <p className="text-xs text-gray-400 text-center">
          <button className="hover:underline">Termos de uso</button>
          {' • '}
          <button className="hover:underline">Política de privacidade</button>
          {' • '}
          <span>© Boost</span>
        </p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-full py-3.5 px-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-sm font-medium text-gray-700">Login com o Google</span>
        </button>
      </div>

      <style jsx global>{`
        @keyframes fillProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
