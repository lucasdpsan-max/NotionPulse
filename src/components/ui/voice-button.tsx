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
      className={`flex items-center gap-1.5 text-white text-xs px-3.5 py-2 rounded-full font-medium transition-all ${
        isRecording
          ? 'bg-red-500 animate-pulse'
          : 'bg-[#0D2137] hover:bg-[#1a3a5c]'
      }`}
    >
      <span>🎤</span>
      <span>{isRecording ? 'Gravando...' : label}</span>
    </button>
  );
}
