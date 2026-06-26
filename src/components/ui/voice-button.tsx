'use client';

import React from 'react';

interface VoiceButtonProps {
  onClick?: () => void;
  isRecording?: boolean;
  label?: string;
}

export function VoiceButton({
  onClick,
  isRecording = false,
  label = 'Falar',
}: VoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-white text-sm px-4 py-2 rounded-full font-medium transition-all ${
        isRecording ? 'bg-red-500 animate-pulse' : 'bg-black hover:bg-[#242320]'
      }`}
    >
      <span>🎤</span>
      <span>{isRecording ? 'Gravando...' : label}</span>
    </button>
  );
}
