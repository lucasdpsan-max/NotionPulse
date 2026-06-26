'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import IllustrationHome from '@/assets/Illustration_home.svg';
import {
  useCreateTask,
  useDeleteTask,
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

function buildICS(items: { id: string; title: string }[]): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const now = new Date();
  const day = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const stamp = `${day}T${pad(now.getHours())}${pad(now.getMinutes())}00`;
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NotionPulse//PT-BR', 'CALSCALE:GREGORIAN'];
  for (const t of items) {
    const summary = t.title.replace(/[\n,;]/g, ' ').trim();
    lines.push(
      'BEGIN:VEVENT',
      `UID:${t.id}@notionpulse`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${day}`,
      `SUMMARY:${summary}`,
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

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
  const deleteTask = useDeleteTask();
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [sharedSheetOpen, setSharedSheetOpen] = useState(false);
  const [agendaSheetOpen, setAgendaSheetOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
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

  const handleFeatureClick = (id: string) => {
    if (id === 'voice') startRecording();
    else if (id === 'shared') {
      setFeedback('');
      setSharedSheetOpen(true);
    } else if (id === 'agenda') {
      setFeedback('');
      setAgendaSheetOpen(true);
    }
  };

  // Tarefas compartilhadas — share the pending list via the Web Share API,
  // falling back to copying it to the clipboard.
  const shareTasks = async () => {
    const pending = tasks.filter((t) => !t.completed);
    const text = pending.length
      ? `Minhas tarefas no NotionPulse:\n${pending.map((t) => `• ${t.title}`).join('\n')}`
      : 'Minha lista de tarefas no NotionPulse';
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'NotionPulse', text });
        setFeedback('Compartilhado!');
      } else {
        await navigator.clipboard.writeText(text);
        setFeedback('Lista copiada para a área de transferência!');
      }
    } catch {
      setFeedback('Não foi possível compartilhar.');
    }
  };

  // Sintonize sua agenda — export pending tasks as an .ics calendar file that
  // can be imported into Google Calendar, Apple Calendar, Outlook, etc.
  const exportToCalendar = () => {
    const pending = tasks.filter((t) => !t.completed);
    if (pending.length === 0) {
      setFeedback('Nenhuma tarefa pendente para sincronizar.');
      return;
    }
    const ics = buildICS(pending);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notionpulse.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setFeedback(`${pending.length} tarefa(s) exportada(s) para a agenda.`);
  };

  const handleFileUpload = () => fileInputRef.current?.click();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsAnalyzingImage(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('/api/image', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Falha ao analisar a imagem');
      const data = await res.json();
      const titles: string[] = Array.isArray(data.tasks) ? data.tasks : [];
      titles.forEach((title) => createTask.mutate({ title }));
    } catch {
      createTask.mutate({ title: `Imagem: ${file.name}` });
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  return (
    <div className="relative max-w-[390px] mx-auto min-h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#eadbfa] flex items-center justify-center overflow-hidden">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#7237ae] text-sm font-bold">{user.name[0]}</span>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-[#242320]">{user.name}</p>
            <p className="text-[10px] text-[#78736f]">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/pomodoro"
            className="flex items-center gap-1.5 bg-white border border-[#edeceb] text-[#242320] text-xs px-3 py-2 rounded-full font-medium"
          >
            <span>⏱</span>
            <span>Pomodoro</span>
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full bg-[#f7f7f5] border border-[#edeceb]"
          >
            <span className="block w-4 h-0.5 bg-[#242320] rounded-full" />
            <span className="block w-4 h-0.5 bg-[#242320] rounded-full" />
            <span className="block w-4 h-0.5 bg-[#242320] rounded-full" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-5 pt-4 pb-2">
        <div className="relative">
          <h1 className="text-[40px] leading-[44px] font-medium tracking-[-0.4px]">
            <span className="text-[#78736f]">Olá, {user.name}.</span>
            <br />
            <span className="text-[#242320]">Vamos começar?</span>
          </h1>
          <p className="text-sm text-[#78736f] mt-3">Transforme ideias em ações.</p>

          <div className="flex gap-3 mt-4">
            <button className="w-12 h-12 rounded-2xl bg-[#eadbfa] flex items-center justify-center text-xl">☕</button>
            <button className="w-12 h-12 rounded-2xl bg-[#e6f3fe] flex items-center justify-center text-xl">🐱</button>
            <button className="w-12 h-12 rounded-2xl bg-[#ffdec4] flex items-center justify-center text-xl">🏀</button>
          </div>

          <div className="absolute right-[-10px] top-[68px] w-[150px] h-[150px] pointer-events-none">
            <IllustrationHome width={150} height={150} aria-label="Home illustration" />
          </div>
        </div>
      </section>

      {/* Feature List */}
      <section className="px-5 pt-6 flex flex-col gap-3">
        {featureItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-4 bg-[#f7f7f5] rounded-2xl px-3 py-3 hover:bg-[#f0efed] transition-colors text-left"
            onClick={() => handleFeatureClick(item.id)}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg flex-shrink-0 shadow-[0px_2px_6px_0px_rgba(95,91,87,0.08)]">
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#242320]">{item.title}</p>
              <p className="text-xs text-[#78736f] mt-0.5">{item.subtitle}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#a8a4a0] flex-shrink-0">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </section>

      {/* Task list */}
      <section className="px-5 pt-6 pb-4 flex-1">
        <h2 className="text-sm font-semibold text-[#242320] mb-3">
          Suas tarefas
          {isAnalyzingImage && (
            <span className="ml-2 text-xs font-normal text-[#78736f]">analisando imagem…</span>
          )}
        </h2>
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
                className="flex items-center gap-3 bg-[#f7f7f5] rounded-xl px-4 py-3"
              >
                <button
                  onClick={() =>
                    updateTask.mutate({ id: task.id, completed: !task.completed })
                  }
                  aria-label="Concluir tarefa"
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    task.completed ? 'bg-[#7237ae] border-[#7237ae]' : 'border-gray-300'
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
                    task.completed ? 'text-[#a8a4a0] line-through' : 'text-[#242320]'
                  }`}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask.mutate(task.id)}
                  aria-label="Remover tarefa"
                  className="text-gray-300 hover:text-red-400 flex-shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bottom Chat Input */}
      <div className="px-5 pb-8 pt-4 bg-white">
        <div className="bg-white rounded-2xl border border-[#edeceb] shadow-[0px_8px_24px_0px_rgba(95,91,87,0.08)] px-4 py-3 flex flex-col gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFromInput();
            }}
            placeholder="Conte o que precisa organizar hoje"
            className="w-full text-sm text-[#242320] bg-transparent outline-none placeholder:text-[#a8a4a0]"
          />
          <div className="flex items-center justify-between">
          <button
            onClick={handleFileUpload}
            aria-label="Enviar imagem"
            className="w-9 h-9 rounded-full bg-white border border-[#edeceb] flex items-center justify-center text-[#242320] hover:bg-[#f7f7f5] transition-colors flex-shrink-0"
          >
            <span className="text-lg leading-none">+</span>
          </button>
          <button
            onClick={inputText.trim() ? handleCreateFromInput : startRecording}
            className="flex items-center gap-1.5 bg-black text-white text-sm px-4 py-2 rounded-full font-medium flex-shrink-0"
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
                { icon: '🏠', label: 'Início', href: '/home' as const, action: undefined },
                { icon: '🎤', label: 'Criar por voz', href: undefined, action: 'voice' as const },
                { icon: '👥', label: 'Tarefas compartilhadas', href: undefined, action: 'shared' as const },
                { icon: '📅', label: 'Sintonize sua agenda', href: undefined, action: 'agenda' as const },
                { icon: '⏱', label: 'Pomodoro', href: '/pomodoro' as const, action: undefined },
                { icon: '⚙️', label: 'Configurações', href: '/home' as const, action: undefined },
              ].map((item) =>
                item.action ? (
                  <button
                    key={item.label}
                    onClick={() => {
                      setMenuOpen(false);
                      handleFeatureClick(item.action);
                    }}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-[#242320]">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-[#242320]">{item.label}</span>
                  </Link>
                ),
              )}
            </nav>
            <div className="mt-auto px-6 pb-8">
              <button
                onClick={() => signOut({ callbackUrl: '/onboarding' })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors"
              >
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

      {/* Shared tasks bottom sheet */}
      {sharedSheetOpen && (
        <>
          <div className="absolute inset-0 bg-black/60 z-40" onClick={() => setSharedSheetOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl px-6 pt-6 pb-10">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <h2 className="text-lg font-bold text-[#242320] text-center mb-2">Tarefas compartilhadas</h2>
            <p className="text-sm text-[#78736f] text-center mb-5">
              Compartilhe sua lista de tarefas com outras pessoas.
            </p>
            <div className="bg-[#f7f7f5] rounded-xl p-4 mb-4 max-h-40 overflow-y-auto">
              {tasks.filter((t) => !t.completed).length === 0 ? (
                <p className="text-xs text-[#78736f]">Nenhuma tarefa pendente para compartilhar.</p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {tasks.filter((t) => !t.completed).map((t) => (
                    <li key={t.id} className="text-sm text-[#242320]">• {t.title}</li>
                  ))}
                </ul>
              )}
            </div>
            {feedback && <p className="text-sm text-[#7237ae] text-center mb-4">{feedback}</p>}
            <button
              onClick={shareTasks}
              className="w-full py-3 rounded-xl bg-black text-white text-sm font-medium"
            >
              Compartilhar lista
            </button>
          </div>
        </>
      )}

      {/* Agenda sync bottom sheet */}
      {agendaSheetOpen && (
        <>
          <div className="absolute inset-0 bg-black/60 z-40" onClick={() => setAgendaSheetOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl px-6 pt-6 pb-10">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <h2 className="text-lg font-bold text-[#242320] text-center mb-2">Sintonize sua agenda</h2>
            <p className="text-sm text-[#78736f] text-center mb-5">
              Exporte suas tarefas pendentes como um arquivo de calendário (.ics) e importe no
              Google Agenda, Apple Calendar ou Outlook.
            </p>
            {feedback && <p className="text-sm text-[#7237ae] text-center mb-4">{feedback}</p>}
            <button
              onClick={exportToCalendar}
              className="w-full py-3 rounded-xl bg-black text-white text-sm font-medium mb-3"
            >
              Adicionar à agenda (.ics)
            </button>
            <button
              onClick={() => setAgendaSheetOpen(false)}
              className="w-full py-3 rounded-xl border border-[#edeceb] text-sm font-medium text-[#78736f]"
            >
              Fechar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
