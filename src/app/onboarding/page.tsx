'use client';

import { useState, useEffect, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import IllustrationSvg from '@/assets/illustration.svg';
import Illustration1Svg from '@/assets/illustration-1.svg';
import Illustration2Svg from '@/assets/illustration-2.svg';

type IllustrationComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const MicIcon = ({ color }: { color: string }) => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="inline-block align-middle">
    <rect x="9" y="3" width="6" height="11" rx="3" stroke={color} strokeWidth="1.6" />
    <path d="M6 11a6 6 0 0012 0M12 17v4M9 21h6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CalendarIcon = ({ color }: { color: string }) => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="inline-block align-middle">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="1.6" />
    <path d="M3 9h18M8 3v4M16 3v4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const PeopleIcon = ({ color }: { color: string }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="inline-block align-middle">
    <circle cx="9" cy="8" r="3" stroke={color} strokeWidth="1.6" />
    <circle cx="16.5" cy="9" r="2.3" stroke={color} strokeWidth="1.6" />
    <path d="M3.5 19a5.5 5.5 0 0111 0M15 19a5 5 0 015.5-4.9" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

type Step = {
  bg: string;
  title: string;
  accent: string;
  subtitleColor: string;
  badge: string;
  titleBefore: string;
  titleAfter: string;
  Icon: ({ color }: { color: string }) => React.ReactElement;
  subtitle: string;
  Illustration: IllustrationComponent;
};

const steps: Step[] = [
  {
    bg: '#f7fbff',
    title: '#002a4f',
    accent: '#002a4f',
    subtitleColor: '#00396b',
    badge: 'Pulse • Voice',
    titleBefore: 'Crie tarefas por comando de',
    titleAfter: 'voz',
    Icon: MicIcon,
    subtitle: 'Fale naturalmente e transforme suas ideias em tarefas.',
    Illustration: IllustrationSvg as IllustrationComponent,
  },
  {
    bg: '#f7fcf8',
    title: '#05210b',
    accent: '#0f6220',
    subtitleColor: '#0a4216',
    badge: 'Pulse • Calendar',
    titleBefore: 'Sua agenda sempre',
    titleAfter: 'em ordem',
    Icon: CalendarIcon,
    subtitle: 'Sincronize seus compromissos e veja tudo em um só lugar.',
    Illustration: Illustration1Svg as IllustrationComponent,
  },
  {
    bg: '#fcfaff',
    title: '#1c0e2c',
    accent: '#7237ae',
    subtitleColor: '#391c57',
    badge: 'Pulse • Team',
    titleBefore: 'Crie uma agenda com seu',
    titleAfter: 'grupo',
    Icon: PeopleIcon,
    subtitle: 'Planeje estudos e compromissos em uma agenda compartilhada.',
    Illustration: Illustration2Svg as IllustrationComponent,
  },
];

const STEP_DURATION = 4000;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [googleConfigured, setGoogleConfigured] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((d) => setGoogleConfigured(Boolean(d.googleConfigured)))
      .catch(() => setGoogleConfigured(false));
  }, []);

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
  const { Illustration, Icon } = step;

  const handleGoogleLogin = async () => {
    if (googleConfigured) {
      await signIn('google', { callbackUrl: '/home' });
    } else {
      // Google not configured yet — enter the app via the local demo user.
      router.push('/home');
    }
  };

  return (
    <div className="flex flex-col max-w-[390px] mx-auto min-h-screen" style={{ backgroundColor: step.bg, transition: 'background-color 0.4s ease' }}>
      {/* Sliding top section */}
      <div
        className="flex-1 flex flex-col items-center px-6 pt-10 pb-6"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateX(-40px)' : 'translateX(0)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        {/* Illustration */}
        <div className="w-full flex justify-center mb-6 mt-4">
          <Illustration width={300} height={240} className="max-w-full" aria-label="Illustration" />
        </div>

        {/* Badge */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="w-4 h-4 rounded-[4px] bg-black flex items-center justify-center text-white text-[9px] font-bold leading-none">
            N
          </span>
          <span className="text-xs font-medium" style={{ color: step.title }}>
            {step.badge}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-center font-medium tracking-[-0.4px] text-[40px] leading-[44px]"
          style={{ color: step.title, fontFamily: 'var(--font-sans), Roboto, sans-serif' }}
        >
          {step.titleBefore}{' '}
          <Icon color={step.accent} />{' '}
          {step.titleAfter}
        </h1>

        {/* Subtitle */}
        <p className="text-center text-base leading-6 mt-4 px-2" style={{ color: step.subtitleColor }}>
          {step.subtitle}
        </p>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mt-8">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentStep(i);
                setProgressKey((k) => k + 1);
              }}
              aria-label={`Ir para o passo ${i + 1}`}
              className="transition-all duration-300"
            >
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === currentStep ? 28 : 24,
                  backgroundColor: i === currentStep ? step.accent : '#00000020',
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fixed bottom section */}
      <div className="px-6 pb-8 pt-4 flex flex-col gap-5" style={{ backgroundColor: step.bg, transition: 'background-color 0.4s ease' }}>
        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white rounded-full py-4 px-6 shadow-[0px_2px_2px_0px_rgba(0,57,107,0.1),0px_8px_12px_0px_rgba(0,57,107,0.1)] active:scale-[0.99] transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-sm font-medium text-[#242320]">Login com o Google</span>
        </button>

        {/* Terms */}
        <p className="text-xs text-[#78736f] text-center">
          <button className="hover:underline">Termos de uso</button>
          {'  •  '}
          <button className="hover:underline">Política de privacidade</button>
          {'  •  '}
          <span>© Boost</span>
        </p>
      </div>
    </div>
  );
}
