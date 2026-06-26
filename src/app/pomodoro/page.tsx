'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks, useUpdateTask, type Task } from '@/hooks/use-tasks';

const RADIUS = 120;
const CX = 160;
const CY = 160;
const STROKE_WIDTH = 12;
const TOTAL_MARKS = 36;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function PomodoroPage() {
  const router = useRouter();
  const { data: tasks = [] } = useTasks();
  const updateTask = useUpdateTask();
  const pendingTasks = tasks.filter((t) => !t.completed);

  const [minutes, setMinutes] = useState(15);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [taskSheetOpen, setTaskSheetOpen] = useState(false);
  const [linkedTaskId, setLinkedTaskId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const linkedTask = tasks.find((t) => t.id === linkedTaskId) ?? null;

  // Calculate angle from minutes (1-60 → 6° to 360°)
  const angle = (minutes / 60) * 360;

  // Format time display
  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;
  const timeString = `${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;

  // Progress arc angle during countdown
  const progressAngle = isRunning || isDone
    ? (secondsLeft / (minutes * 60)) * 360
    : angle;

  // Handle drag
  const getAngleFromPoint = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = (clientX - rect.left) * (320 / rect.width);
    const svgY = (clientY - rect.top) * (320 / rect.height);
    const dx = svgX - CX;
    const dy = svgY - CY;
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    return deg;
  }, []);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || isRunning) return;
    const deg = getAngleFromPoint(clientX, clientY);
    const newMinutes = Math.max(1, Math.min(60, Math.round((deg / 360) * 60)));
    setMinutes(newMinutes);
    setSecondsLeft(newMinutes * 60);
  }, [isDragging, isRunning, getAngleFromPoint]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [handleDragMove]);

  // Timer countdown
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setIsDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // When the timer finishes, mark the linked task as completed.
  useEffect(() => {
    if (isDone && linkedTaskId) {
      updateTask.mutate({ id: linkedTaskId, completed: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone]);

  const handleFinish = () => {
    if (linkedTaskId) {
      updateTask.mutate({ id: linkedTaskId, completed: true });
    }
    router.back();
  };

  const handlePlay = () => {
    if (isDone) {
      handleReset();
      return;
    }
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsDone(false);
    setSecondsLeft(minutes * 60);
  };

  // Tick marks
  const ticks = Array.from({ length: TOTAL_MARKS }, (_, i) => {
    const tickAngle = (i / TOTAL_MARKS) * 360;
    const inner = polarToCartesian(CX, CY, RADIUS + 16, tickAngle);
    const outer = polarToCartesian(CX, CY, RADIUS + 24, tickAngle);
    const isHighlight = i % 3 === 0;
    return { inner, outer, isHighlight };
  });

  // Handle point for draggable arc end
  const handlePoint = polarToCartesian(CX, CY, RADIUS, progressAngle);

  return (
    <div className="flex flex-col max-w-[390px] mx-auto min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f7f7f5] border border-[#edeceb]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#242320" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h1 className="text-sm font-semibold text-[#242320]">Pomodoro</h1>
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f7f7f5] border border-[#edeceb] text-lg">
          🎵
        </button>
      </header>

      {/* Link Task */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setTaskSheetOpen(true)}
          className="flex items-center gap-2 bg-[#f7f7f5] border border-[#edeceb] rounded-full px-4 py-2 text-sm font-medium text-[#242320]"
        >
          {linkedTask ? (
            <>
              <span className="text-green-500">✓</span>
              <span className="max-w-[180px] truncate">{linkedTask.title}</span>
            </>
          ) : (
            <>
              <span>Vincular tarefa</span>
              <span className="text-gray-400">›</span>
            </>
          )}
        </button>
      </div>

      {/* Title */}
      <div className="text-center px-5 mb-6">
        <h2 className="text-[28px] leading-[31px] font-medium">
          <span className="text-[#5f5b57]">Ativar </span>
          <span className="text-[#e89d01]">⚡</span>
          <span className="text-[#242320]"> modo foco</span>
        </h2>
        <p className="text-sm text-[#78736f] mt-1">Foque em uma tarefa de cada vez</p>
      </div>

      {/* Circular Timer */}
      <div className="flex justify-center mb-6">
        <svg
          ref={svgRef}
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="select-none touch-none"
        >
          <defs>
            {/* Background ring: lighter lilac -> darker lilac */}
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f3ebfc" />
              <stop offset="100%" stopColor="#c9a8ec" />
            </linearGradient>
            {/* Progress arc: medium -> darkest purple */}
            <linearGradient id="progGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a06fd0" />
              <stop offset="100%" stopColor="#7237ae" />
            </linearGradient>
          </defs>

          {/* Tick marks every 10° */}
          {ticks.map((tick, i) => (
            <line
              key={i}
              x1={tick.inner.x}
              y1={tick.inner.y}
              x2={tick.outer.x}
              y2={tick.outer.y}
              stroke={tick.isHighlight ? '#c9a8ec' : '#eadbfa'}
              strokeWidth={tick.isHighlight ? 2 : 1}
              strokeLinecap="round"
            />
          ))}

          {/* Background ring with light -> dark lilac gradient */}
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth={STROKE_WIDTH}
          />

          {/* Progress arc */}
          {progressAngle > 0 && (
            <path
              d={describeArc(CX, CY, RADIUS, 0, Math.min(progressAngle, 359.99))}
              fill="none"
              stroke="url(#progGrad)"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
            />
          )}

          {/* Dial labels: 60 (top), 15 (right), 30 (bottom), 45 (left) */}
          {([
            { label: '60', angle: 0 },
            { label: '15', angle: 90 },
            { label: '30', angle: 180 },
            { label: '45', angle: 270 },
          ] as const).map(({ label, angle: a }) => {
            const p = polarToCartesian(CX, CY, RADIUS - 30, a);
            return (
              <text
                key={label}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="15"
                fill="#78736f"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {label}
              </text>
            );
          })}

          {/* Draggable handle */}
          <circle
            cx={handlePoint.x}
            cy={handlePoint.y}
            r={14}
            fill="white"
            stroke="#7237ae"
            strokeWidth={2}
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              e.preventDefault();
              if (!isRunning) setIsDragging(true);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              if (!isRunning) setIsDragging(true);
            }}
          />
          {/* Chevron down inside handle */}
          <path
            d={`M ${handlePoint.x - 4} ${handlePoint.y - 2} L ${handlePoint.x} ${handlePoint.y + 2} L ${handlePoint.x + 4} ${handlePoint.y - 2}`}
            fill="none"
            stroke="#7237ae"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center display */}
          <text
            x={CX}
            y={CY - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="48"
            fontWeight="500"
            fill="#000000"
            fontFamily="Geist, system-ui, sans-serif"
            letterSpacing="-0.4"
          >
            {timeString}
          </text>
          <text
            x={CX}
            y={CY + 30}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fill="#78736f"
            fontFamily="Inter, system-ui, sans-serif"
          >
            minutos
          </text>

          {isDone && (
            <text
              x={CX}
              y={CY + 50}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill="#10B981"
              fontFamily="system-ui, sans-serif"
            >
              ✓ Concluído!
            </text>
          )}
        </svg>
      </div>

      {/* Control Buttons — Resetar | Play | Finalizar */}
      <div className="flex items-center justify-center gap-4 px-5 mb-8">
        {/* Reset (label left of circle) */}
        <button onClick={handleReset} className="flex items-center gap-2">
          <span className="text-[10px] text-[#78736f]">Resetar</span>
          <div className="w-10 h-10 rounded-full bg-white border border-[#edeceb] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="#5f5b57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="#5f5b57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>

        {/* Play / Pause (large black) */}
        <button
          onClick={isRunning ? handleStop : handlePlay}
          aria-label={isRunning ? 'Pausar' : 'Iniciar'}
          className="w-[72px] h-[72px] rounded-full bg-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          {isRunning ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1" fill="white"/>
              <rect x="14" y="4" width="4" height="16" rx="1" fill="white"/>
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M6 4l14 8-14 8V4z" fill="white"/>
            </svg>
          )}
        </button>

        {/* Finalizar (circle then label right) */}
        <button onClick={handleFinish} className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white border border-[#edeceb] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="3" fill="#242320"/>
            </svg>
          </div>
          <span className="text-[10px] text-[#78736f]">Finalizar</span>
        </button>
      </div>

      {/* Bottom text */}
      <div className="flex-1 flex items-end justify-center pb-10 px-5">
        <p className="text-xs text-[#78736f] text-center">
          Sem distrações. Só você e a próxima tarefa
        </p>
      </div>

      {/* Task Link Bottom Sheet */}
      {taskSheetOpen && (
        <>
          <div
            className="absolute inset-0 bg-black/40 z-40"
            onClick={() => setTaskSheetOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-4 mb-2" />
            <div className="px-5 py-4">
              <h3 className="text-base font-bold text-[#0D2137] mb-4">Selecionar tarefa</h3>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {pendingTasks.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    Nenhuma tarefa pendente. Crie tarefas na tela inicial.
                  </p>
                ) : (
                  pendingTasks.map((task: Task) => (
                    <button
                      key={task.id}
                      onClick={() => {
                        setLinkedTaskId(task.id);
                        setTaskSheetOpen(false);
                      }}
                      className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 text-left"
                    >
                      <p className="text-sm font-medium text-[#0D2137]">{task.title}</p>
                      {linkedTaskId === task.id && <span className="text-[#7C3AED]">✓</span>}
                    </button>
                  ))
                )}
              </div>
              <button
                onClick={() => setTaskSheetOpen(false)}
                className="w-full mt-4 py-3 text-sm text-gray-500 border border-gray-200 rounded-xl mb-4"
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
