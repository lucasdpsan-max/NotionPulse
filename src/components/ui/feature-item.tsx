import React from 'react';

interface FeatureItemProps {
  icon: string;
  title: string;
  subtitle: string;
  iconBgColor?: string;
  onClick?: () => void;
}

export function FeatureItem({
  icon,
  title,
  subtitle,
  iconBgColor = '#EDE9FE',
  onClick,
}: FeatureItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md transition-shadow text-left"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#0D2137]">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className="text-gray-300 flex-shrink-0"
      >
        <path
          d="M9 18l6-6-6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
