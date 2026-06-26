import type { Meta, StoryObj } from '@storybook/nextjs';

const TypographyScale = () => (
  <div className="p-8 bg-white min-h-screen max-w-2xl">
    <h1 className="text-2xl font-bold text-[#0D2137] mb-8">Typography Scale</h1>

    <section className="mb-10">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">Headings</h2>
      <div className="flex flex-col gap-6">
        {[
          { label: '5xl / 48px', className: 'text-5xl font-bold text-[#0D2137]', text: 'Heading 5XL' },
          { label: '4xl / 36px', className: 'text-4xl font-bold text-[#0D2137]', text: 'Heading 4XL' },
          { label: '3xl / 30px', className: 'text-3xl font-bold text-[#0D2137]', text: 'Heading 3XL' },
          { label: '2xl / 24px', className: 'text-2xl font-bold text-[#0D2137]', text: 'Heading 2XL' },
          { label: 'xl / 20px', className: 'text-xl font-bold text-[#0D2137]', text: 'Heading XL' },
          { label: 'lg / 18px', className: 'text-lg font-semibold text-[#0D2137]', text: 'Heading LG' },
        ].map(({ label, className, text }) => (
          <div key={label} className="flex items-baseline gap-4">
            <span className="text-xs text-gray-400 font-mono w-24 flex-shrink-0">{label}</span>
            <span className={className}>{text}</span>
          </div>
        ))}
      </div>
    </section>

    <section className="mb-10">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">Body Text</h2>
      <div className="flex flex-col gap-4">
        {[
          { label: 'base / 16px', className: 'text-base text-gray-800', text: 'Body base — Transforme ideias em ações.' },
          { label: 'sm / 14px', className: 'text-sm text-gray-600', text: 'Body small — Fale naturalmente e transforme suas ideias em tarefas.' },
          { label: 'xs / 12px', className: 'text-xs text-gray-400', text: 'Body xs — Estudo sem vínculo oficial com a marca.' },
        ].map(({ label, className, text }) => (
          <div key={label} className="flex items-start gap-4">
            <span className="text-xs text-gray-400 font-mono w-24 flex-shrink-0 pt-0.5">{label}</span>
            <span className={className}>{text}</span>
          </div>
        ))}
      </div>
    </section>

    <section className="mb-10">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">Font Weights</h2>
      <div className="flex flex-col gap-3">
        {[
          { weight: 'font-normal', label: 'Regular (400)' },
          { weight: 'font-medium', label: 'Medium (500)' },
          { weight: 'font-semibold', label: 'Semibold (600)' },
          { weight: 'font-bold', label: 'Bold (700)' },
          { weight: 'font-extrabold', label: 'Extrabold (800)' },
        ].map(({ weight, label }) => (
          <div key={weight} className="flex items-center gap-4">
            <span className="text-xs text-gray-400 font-mono w-24 flex-shrink-0">{weight.replace('font-', '')}</span>
            <span className={`text-base text-[#0D2137] ${weight}`}>{label}</span>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">Color Variants</h2>
      <div className="flex flex-col gap-3">
        {[
          { color: 'text-[#0D2137]', label: 'Primary Navy', text: 'NotionPulse — Primary Text' },
          { color: 'text-gray-600', label: 'Secondary', text: 'NotionPulse — Secondary Text' },
          { color: 'text-gray-400', label: 'Muted', text: 'NotionPulse — Muted Text' },
          { color: 'text-[#7C3AED]', label: 'Purple', text: 'NotionPulse — Accent Text' },
          { color: 'text-[#F5A623]', label: 'Yellow', text: 'NotionPulse — Yellow Text' },
        ].map(({ color, label, text }) => (
          <div key={color} className="flex items-center gap-4">
            <span className="text-xs text-gray-400 font-mono w-28 flex-shrink-0">{label}</span>
            <span className={`text-base font-medium ${color}`}>{text}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const meta: Meta = {
  title: 'Design System/Typography',
  component: TypographyScale,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
  },
};

export default meta;

type Story = StoryObj;

export const Scale: Story = {};
