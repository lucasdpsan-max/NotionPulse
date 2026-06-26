'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import IllustrationHome from '@/assets/Illustration_home.svg';
import {
  useCreateTask,
  useTasks,
  useUpdateTask,
  type Task,
} from '@/hooks/use-tasks';

const featureItems = [
  {
    id: 'voice',
    icon: '🎤',
    title: 'Crie por voz',
    subtitle: 'Fale para criar tarefas',
    color: '#EDE9FE',
  },
  {
    id: 'shared',
    icon: '👥',
    title: 'Tarefas compartilhadas',
    subtitle: 'Planeje com outras pessoas',
    color: '#E8F0F7',
  },
  {
    id: 'agenda',
    icon: '📅',
    title: 'Sintonize sua agenda',
    subtitle: 'Conecte seus compromissos',
    color: '#F0FDF4',
  },
];

export default function HomePage() {
  const { data: session } = useSession();
  const user = {
    name: session?.user?.name ?? 'Lucas',
    email: session?.user?.email ?? 'lucas@email.com',
    image: session?.user?.image ?? null,
  };

  const { data: tasks = [], isLoading } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const [menuOpen, setMenuOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [inputText, setInputText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleCreateFromInput = () => {
    const title = inputText.trim();
    if (!title) return;
    createTask.mutate({ title });
    setInputText('');
  };

  const transcribe = async (blob: Blob) => {
    setIsTranscribing(true);
    setVoiceError('');
    try {
      const form = new FormData();
      form.append('audio', blob, 'audio.webm');
      const res = await fetch('/api/voice', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Falha na transcrição');
      const data = await res.json();
      setTranscription(data.text ?? '');
    } catch {
      setVoiceError('Não foi possível transcrever o áudio.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const startRecording = async () => {
    setVoiceModalOpen(true);
    setTranscription('');
    setVoiceError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        void transcribe(blob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      // No mic / permission denied — fall back to the mock transcription endpoint.
      setIsRecording(false);
      void transcribe(new Blob(['mock'], { type: 'audio/webm' }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const confirmVoiceTask = () => {
    const title = transcription.trim();
    if (title) createTask.mutate({ title });
    setVoiceModalOpen(false);
    setTranscription('');
  };

  const handleFileUpload = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Image-to-task extraction would run here; for now create a placeholder task.
      createTask.mutate({ title: `Imagem: ${file.name}` });
    }
    e.target.value = '';
  };

  return (
    <div className="relative max-w-[390px] mx-auto min-h-screen bg-[#F5F5F0] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0D2137] flex items-center justify-center overflow-hidden">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-sm font-bold">{user.name[0]}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0D2137]">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
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
            aria-label="Abrir menu"
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
          <p className="text-gray-400 text-base">Olá, {user.name}.</p>
          <h1 className="text-2xl font-bold text-[#0D2137] mt-1">Vamos começar?</h1>
          <p className="text-sm text-gray-400 mt-1">Transforme ideias em ações.</p>

          <div className="flex gap-3 mt-4">
            <button className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-lg">🎤</button>
            <button className="w-10 h-10 rounded-xl bg-[#E8F0F7] flex items-center justify-center text-lg">📋</button>
            <button className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-lg">⚡</button>
          </div>

          <div className="absolute right-0 top-0 w-36 h-36 pointer-events-none">
            <IllustrationHome width={144} height={144} aria-label="Home illustration" />
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
              if (item.id === 'voice') startRecording();
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
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </section>

      {/* Task list */}
      <section className="px-5 pt-6 pb-4 flex-1">
        <h2 className="text-sm font-semibold text-[#0D2137] mb-3">Suas tarefas</h2>
        {isLoading ? (
          <p className="text-xs text-gray-400">Carregando…</p>
        ) : tasks.length === 0 ? (
          <p className="text-xs text-gray-400">
            Nenhuma tarefa ainda. Crie uma falando ou digitando abaixo.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tasks.map((task: Task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm"
              >
                <button
                  onClick={() =>
                    updateTask.mutate({ id: task.id, completed: !task.completed })
                  }
                  aria-label="Concluir tarefa"
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    task.completed ? 'bg-[#7C3AED] border-[#7C3AED]' : 'border-gray-300'
                  }`}
                >
                  {task.completed && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span
                  className={`text-sm flex-1 ${
                    task.completed ? 'text-gray-400 line-through' : 'text-[#0D2137]'
                  }`}
                >
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bottom Chat Input */}
      <div className="px-5 pb-8 pt-4 bg-[#F5F5F0]">
        <div className="bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleFileUpload}
            aria-label="Enviar imagem"
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <span className="text-lg leading-none">+</span>
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFromInput();
            }}
            placeholder="Conte o que precisa organizar hoje"
            className="flex-1 text-sm text-gray-600 bg-transparent outline-none placeholder:text-gray-300"
          />
          <button
            onClick={inputText.trim() ? handleCreateFromInput : startRecording}
            className="flex items-center gap-1.5 bg-[#0D2137] text-white text-xs px-3.5 py-2 rounded-full font-medium flex-shrink-0"
          >
            {inputText.trim() ? (
              <span>Criar</span>
            ) : (
              <>
                <span>🎤</span>
                <span>Falar</span>
              </>
            )}
          </button>
        </div>
      </div>

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
          <div className="absolute inset-0 bg-black/40 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 pt-12 pb-6 border-b border-gray-100">
              <span className="font-bold text-[#0D2137] text-lg">Menu</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu" className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
            onClick={() => !isRecording && !isTranscribing && setVoiceModalOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl px-6 pt-6 pb-10">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <h2 className="text-lg font-bold text-[#0D2137] text-center mb-6">
              {isRecording ? 'Gravando…' : isTranscribing ? 'Transcrevendo…' : 'Transcrição'}
            </h2>

            <div className="flex justify-center mb-6">
              <button
                onClick={isRecording ? stopRecording : undefined}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
                  isRecording ? 'bg-red-100 animate-pulse' : 'bg-[#EDE9FE]'
                }`}
              >
                🎤
              </button>
            </div>

            {voiceError && <p className="text-sm text-red-500 text-center mb-4">{voiceError}</p>}

            {transcription && (
              <div className="bg-[#F5F5F0] rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600">{transcription}</p>
              </div>
            )}

            {isRecording ? (
              <p className="text-xs text-gray-400 text-center">Toque no microfone para parar</p>
            ) : !isTranscribing ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setVoiceModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmVoiceTask}
                  disabled={!transcription.trim()}
                  className="flex-1 py-3 rounded-xl bg-[#0D2137] text-white text-sm font-medium disabled:opacity-40"
                >
                  Criar tarefa
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
