import type { Meta, StoryObj } from '@storybook/nextjs';
import { tokens } from '@/lib/tokens';

const TokensOverview = () => (
  <div className="p-8 bg-[#F5F5F0] min-h-screen max-w-3xl">
    <h1 className="text-2xl font-bold text-[#0D2137] mb-2">Design Tokens</h1>
    <p className="text-sm text-gray-500 mb-10">Fonte única da verdade para o sistema de design do NotionPulse.</p>

    {/* Spacing */}
    <section className="mb-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Spacing Scale</h2>
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-3">
        {(Object.entries(tokens.spacing) as [string, string][]).map(([key, value]) => (
          <div key={key} className="flex items-center gap-4">
            <span className="text-xs font-mono text-gray-400 w-8">{key}</span>
            <span className="text-xs font-mono text-gray-400 w-16">{value}</span>
            <div className="bg-[#7C3AED] rounded-sm h-4" style={{ width: value }} />
          </div>
        ))}
      </div>
    </section>

    {/* Border Radius */}
    <section className="mb-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Border Radius</h2>
      <div className="bg-white rounded-2xl p-6 flex flex-wrap gap-6">
        {(Object.entries(tokens.borderRadius) as [string, string][]).map(([key, value]) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <div
              className="w-12 h-12 bg-[#E8F0F7] border-2 border-[#0D2137]/20"
              style={{ borderRadius: value === '9999px' ? '9999px' : value }}
            />
            <span className="text-xs font-mono text-gray-500">{key}</span>
            <span className="text-xs text-gray-400">{value}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Shadows */}
    <section className="mb-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Shadows</h2>
      <div className="bg-white rounded-2xl p-6 flex flex-wrap gap-6">
        {(Object.entries(tokens.shadows) as [string, string][]).map(([key]) => (
          <div key={key} className="flex flex-col items-center gap-3">
            <div
              className="w-16 h-16 bg-white rounded-xl"
              style={{ boxShadow: tokens.shadows[key as keyof typeof tokens.shadows] }}
            />
            <span className="text-xs font-mono text-gray-500">{key}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Typography tokens */}
    <section>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Typography Tokens</h2>
      <div className="bg-white rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-2">Font Family</p>
            <p className="text-sm font-mono text-gray-700">geist-sans</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Mono Family</p>
            <p className="text-sm font-mono text-gray-700">geist-mono</p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const meta: Meta = {
  title: 'Design System/Tokens',
  component: TokensOverview,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {};
