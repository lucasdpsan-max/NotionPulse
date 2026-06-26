import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from '@/components/ui/button';
import { VoiceButton } from '@/components/ui/voice-button';

const ButtonsPage = () => (
  <div className="p-8 bg-[#F5F5F0] min-h-screen">
    <h1 className="text-2xl font-bold text-[#0D2137] mb-8">Buttons</h1>

    {/* shadcn Button variants */}
    <section className="mb-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">shadcn/ui Button Variants</h2>
      <div className="bg-white rounded-2xl p-6 flex flex-wrap gap-3">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </section>

    {/* Button sizes */}
    <section className="mb-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Button Sizes</h2>
      <div className="bg-white rounded-2xl p-6 flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">🎤</Button>
      </div>
    </section>

    {/* Custom NotionPulse buttons */}
    <section className="mb-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">NotionPulse Custom Buttons</h2>
      <div className="bg-white rounded-2xl p-6 flex flex-wrap gap-4">
        {/* Primary Navy pill */}
        <button className="flex items-center gap-2 bg-[#0D2137] text-white text-sm font-medium px-5 py-2.5 rounded-full">
          Primary Navy Pill
        </button>

        {/* Google Login */}
        <button className="flex items-center gap-3 bg-white border border-gray-200 rounded-full py-2.5 px-5 shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-sm font-medium text-gray-700">Login com o Google</span>
        </button>

        {/* Pomodoro pill */}
        <button className="flex items-center gap-1.5 bg-[#0D2137] text-white text-xs px-3 py-1.5 rounded-full font-medium">
          <span>⏱</span>
          <span>Pomodoro</span>
        </button>

        {/* Purple outline pill */}
        <button className="flex items-center gap-2 border border-[#7C3AED] text-[#7C3AED] text-sm font-medium px-5 py-2 rounded-full">
          Vincular tarefa ›
        </button>

        {/* Icon action buttons */}
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-xl">🎤</button>
          <button className="w-10 h-10 rounded-xl bg-[#E8F0F7] flex items-center justify-center text-xl">📋</button>
          <button className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-xl">⚡</button>
        </div>
      </div>
    </section>

    {/* Voice Button component */}
    <section className="mb-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Voice Button Component</h2>
      <div className="bg-white rounded-2xl p-6 flex flex-wrap gap-4">
        <VoiceButton label="Falar" />
        <VoiceButton label="Gravando..." isRecording />
      </div>
    </section>

    {/* Pomodoro controls */}
    <section>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Pomodoro Control Buttons</h2>
      <div className="bg-white rounded-2xl p-6 flex items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs text-gray-400">Resetar</span>
        </div>
        <div className="w-16 h-16 rounded-full bg-[#0D2137] flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M5 3l14 9-14 9V3z" fill="white"/>
          </svg>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#6B7280" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <span className="text-xs text-gray-400">Parar</span>
        </div>
      </div>
    </section>
  </div>
);

const meta: Meta = {
  title: 'Design System/Buttons',
  component: ButtonsPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const AllButtons: Story = {};
