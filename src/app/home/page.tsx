'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import IllustrationHome from '@/assets/Illustration_home.svg';

const mockUser = {
  name: 'Lucas',
  email: 'lucas@email.com',
  image: null as string | null,
};

const featureItems = [
  {
    id: 'voice',
    icon: '🎤',
    title: 'Crie por voz',
    subtitle: 'Fale para criar tarefas',
    href: '#voice',
    color: '#EDE9FE',
  },
  {
    id: 'shared',
    icon: '👥',
    title: 'Tarefas compartilhadas',
    subtitle: 'Planeje com outras pessoas',
    href: '#shared',
    color: '#E8F0F7',
  },
  {
    id: 'agenda',
    icon: '📅',
    title: 'Sintonize sua agenda',
    subtitle: 'Conecte seus compromissos',
    href: '#agenda',
    color: '#F0FDF4',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVoiceStart = () => {
    setVoiceModalOpen(true);
    setIsRecording(true);
    setTranscription('');

    // Simulate recording for 3 seconds then transcribe
    setTimeout(() => {
      setIsRecording(false);
      setTranscription('Criar reunião com a equipe para amanhã às 10h');
    }, 3000);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      // In production: upload image and extract tasks via AI
    }
  };

  return (
    <div className="relative max-w-[390px] mx-auto min-h-screen bg-[#F5F5F0] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0D2137] flex items-center justify-center overflow-hidden">
            {mockUser.image ? (
              <img src={mockUser.image} alt={mockUser.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-sm font-bold">{mockUser.name[0]}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0D2137]">{mockUser.name}</p>
            <p className="text-xs text-gray-400">{mockUser.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/pomodoro"
            className="flex items-center gap-1.5 bg-[#0D2137] text-white text-xs px-3 py-1.5 rounded-full font-medium"
          >
            <span>⏱</span>
            <span>Pomodoro</span>
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          >
            <span className="block w-5 h-0.5 bg-[#0D2137] rounded-full" />
            <span className="block w-5 h-0.5 bg-[#0D2137] rounded-full" />
            <span className="block w-3 h-0.5 bg-[#0D2137] rounded-full self-start" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-5 pt-4 pb-2">
        <div className="relative">
          <p className="text-gray-400 text-base">Olá, {mockUser.name}.</p>
          <h1 className="text-2xl font-bold text-[#0D2137] mt-1">Vamos começar?</h1>
          <p className="text-sm text-gray-400 mt-1">Transforme ideias em ações.</p>

          {/* Action icon buttons */}
          <div className="flex gap-3 mt-4">
            <button className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-lg">
              🎤
            </button>
            <button className="w-10 h-10 rounded-xl bg-[#E8F0F7] flex items-center justify-center text-lg">
              📋
            </button>
            <button className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-lg">
              ⚡
            </button>
          </div>

          {/* Home illustration — positioned to the right */}
          <div className="absolute right-0 top-0 w-36 h-36">
            <IllustrationHome
              width={144}
              height={144}
              className="object-contain"
              aria-label="Home illustration"
            />
          </div>
        </div>
      </section>

      {/* Feature List */}
      <section className="px-5 pt-6 flex flex-col gap-3">
        {featureItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md transition-shadow text-left"
            onClick={() => {
              if (item.id === 'voice') handleVoiceStart();
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: item.color }}
            >
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0D2137]">{item.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-300 flex-shrink-0">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </section>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Chat Input */}
      <div className="px-5 pb-8 pt-4 bg-[#F5F5F0]">
        <div className="bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-3">
          {/* Plus button */}
          <button
            onClick={handleFileUpload}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <span className="text-lg leading-none">+</span>
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Conte o que precisa organizar hoje"
            className="flex-1 text-sm text-gray-600 bg-transparent outline-none placeholder:text-gray-300"
          />
          {/* Voice button */}
          <button
            onClick={handleVoiceStart}
            className="flex items-center gap-1.5 bg-[#0D2137] text-white text-xs px-3.5 py-2 rounded-full font-medium flex-shrink-0"
          >
            <span>🎤</span>
            <span>Falar</span>
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Hamburger Slide Menu */}
      {menuOpen && (
        <>
          <div
            className="absolute inset-0 bg-black/40 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 pt-12 pb-6 border-b border-gray-100">
              <span className="font-bold text-[#0D2137] text-lg">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <nav className="flex flex-col px-4 py-4 gap-1">
              {[
                { icon: '🏠', label: 'Início', href: '/home' },
                { icon: '🎤', label: 'Criar por voz', href: '#voice' },
                { icon: '👥', label: 'Tarefas compartilhadas', href: '#shared' },
                { icon: '📅', label: 'Minha agenda', href: '#agenda' },
                { icon: '⏱', label: 'Pomodoro', href: '/pomodoro' },
                { icon: '⚙️', label: 'Configurações', href: '#settings' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium text-[#0D2137]">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto px-6 pb-8">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors">
                <span>🚪</span>
                <span className="text-sm font-medium text-red-500">Sair</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Voice Recording Modal */}
      {voiceModalOpen && (
        <>
          <div
            className="absolute inset-0 bg-black/60 z-40"
            onClick={() => !isRecording && setVoiceModalOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl px-6 pt-6 pb-10">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <h2 className="text-lg font-bold text-[#0D2137] text-center mb-6">
              {isRecording ? 'Gravando...' : 'Transcrição concluída'}
            </h2>

            {/* Recording animation */}
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
                isRecording ? 'bg-red-100 animate-pulse' : 'bg-[#EDE9FE]'
              }`}>
                🎤
              </div>
            </div>

            {/* Transcription result */}
            {transcription && (
              <div className="bg-[#F5F5F0] rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600">{transcription}</p>
              </div>
            )}

            {/* Actions */}
            {!isRecording && (
              <div className="flex gap-3">
                <button
                  onClick={() => setVoiceModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setInputText(transcription);
                    setVoiceModalOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#0D2137] text-white text-sm font-medium"
                >
                  Criar tarefa
                </button>
              </div>
            )}

            {isRecording && (
              <p className="text-xs text-gray-400 text-center">
                Fale sua tarefa... toque para parar
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
