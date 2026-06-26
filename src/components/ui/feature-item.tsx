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
  iconBgColor = '#ffffff',
  onClick,
}: FeatureItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 bg-[#f7f7f5] rounded-2xl px-3 py-3 hover:bg-[#f0efed] transition-colors text-left"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 shadow-[0px_2px_6px_0px_rgba(95,91,87,0.08)]"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#242320]">{title}</p>
        <p className="text-xs text-[#78736f] mt-0.5">{subtitle}</p>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className="text-[#a8a4a0] flex-shrink-0"
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
