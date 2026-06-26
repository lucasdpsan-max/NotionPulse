import type { Meta, StoryObj } from '@storybook/nextjs';
import { typography } from '@/lib/tokens';

const headingStyles = [
  { label: 'H2 · 48/50', size: '48px', lh: '50px', ls: '-0.4px', text: 'Crie tarefas por voz' },
  { label: 'H3 · 40/44', size: '40px', lh: '44px', ls: '-0.4px', text: 'Vamos começar?' },
  { label: 'H5 · 28/31', size: '28px', lh: '31px', ls: '0', text: 'Ativar modo foco' },
];

const bodyStyles = [
  { label: 'lg · 18/27', size: '18px', lh: '27px', text: 'minutos' },
  { label: 'base · 16/24', size: '16px', lh: '24px', text: 'Transforme ideias em ações.' },
  { label: 'sm · 14/22', size: '14px', lh: '22px', text: 'Fale naturalmente e transforme suas ideias em tarefas.' },
  { label: 'xs · 12/16', size: '12px', lh: '16px', text: 'Estudo sem vínculo oficial com a marca.' },
  { label: '2xs · 10/14', size: '10px', lh: '14px', text: 'Resetar' },
];

const TypographyScale = () => (
  <div className="p-8 bg-white min-h-screen max-w-2xl">
    <h1 className="text-2xl font-bold text-[#242320] mb-1">Tipografia</h1>
    <p className="text-sm text-[#78736f] mb-8">
      Geist (headings) · Inter (body) — escala extraída do Figma.
    </p>

    <section className="mb-10">
      <h2 className="text-xs font-semibold text-[#78736f] uppercase tracking-wider mb-6">
        Headings · Geist
      </h2>
      <div className="flex flex-col gap-6">
        {headingStyles.map(({ label, size, lh, ls, text }) => (
          <div key={label} className="flex items-baseline gap-4">
            <span className="text-xs text-[#78736f] font-mono w-28 flex-shrink-0">{label}</span>
            <span
              style={{
                fontFamily: typography.fontHeading,
                fontSize: size,
                lineHeight: lh,
                letterSpacing: ls,
                fontWeight: 500,
                color: '#242320',
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>
    </section>

    <section className="mb-10">
      <h2 className="text-xs font-semibold text-[#78736f] uppercase tracking-wider mb-6">
        Body · Inter
      </h2>
      <div className="flex flex-col gap-4">
        {bodyStyles.map(({ label, size, lh, text }) => (
          <div key={label} className="flex items-start gap-4">
            <span className="text-xs text-[#78736f] font-mono w-28 flex-shrink-0 pt-1">{label}</span>
            <span style={{ fontFamily: typography.fontBody, fontSize: size, lineHeight: lh, color: '#242320' }}>
              {text}
            </span>
          </div>
        ))}
      </div>
    </section>

    <section className="mb-10">
      <h2 className="text-xs font-semibold text-[#78736f] uppercase tracking-wider mb-6">Pesos</h2>
      <div className="flex flex-col gap-3">
        {[
          { weight: 400, label: 'Regular (400)' },
          { weight: 500, label: 'Medium (500)' },
          { weight: 600, label: 'Semibold (600)' },
        ].map(({ weight, label }) => (
          <div key={weight} className="flex items-center gap-4">
            <span className="text-xs text-[#78736f] font-mono w-28 flex-shrink-0">{weight}</span>
            <span className="text-base text-[#242320]" style={{ fontWeight: weight }}>{label}</span>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xs font-semibold text-[#78736f] uppercase tracking-wider mb-6">Cores de texto</h2>
      <div className="flex flex-col gap-3">
        {[
          { color: '#242320', label: 'text/default' },
          { color: '#5f5b57', label: 'text/soft' },
          { color: '#78736f', label: 'text/subtle' },
          { color: '#000000', label: 'text/strong' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-4">
            <span className="text-xs text-[#78736f] font-mono w-28 flex-shrink-0">{label}</span>
            <span className="text-base font-medium" style={{ color }}>NotionPulse</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const meta: Meta = {
  title: 'Design System/Tipografia',
  component: TypographyScale,
  parameters: { layout: 'fullscreen', backgrounds: { default: 'white' } },
};

export default meta;

type Story = StoryObj;

export const Scale: Story = {};
