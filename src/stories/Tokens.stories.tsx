import type { Meta, StoryObj } from '@storybook/nextjs';
import { tokens } from '@/lib/tokens';

const TokensOverview = () => (
  <div className="p-8 bg-[#fbfbfa] min-h-screen max-w-3xl">
    <h1 className="text-2xl font-bold text-[#242320] mb-1">Tokens</h1>
    <p className="text-sm text-[#78736f] mb-10">Fonte única da verdade do design system, alinhada ao Figma.</p>

    {/* Spacing */}
    <section className="mb-10">
      <h2 className="text-sm font-semibold text-[#78736f] uppercase tracking-wider mb-4">Spacing</h2>
      <div className="bg-white rounded-2xl border border-[#edeceb] p-6 flex flex-col gap-3">
        {(Object.entries(tokens.spacing) as [string, string][]).map(([key, value]) => (
          <div key={key} className="flex items-center gap-4">
            <span className="text-xs font-mono text-[#78736f] w-10">{key}</span>
            <span className="text-xs font-mono text-[#78736f] w-14">{value}</span>
            <div className="bg-[#7237ae] rounded-sm h-4" style={{ width: value }} />
          </div>
        ))}
      </div>
    </section>

    {/* Border Radius */}
    <section className="mb-10">
      <h2 className="text-sm font-semibold text-[#78736f] uppercase tracking-wider mb-4">Radius</h2>
      <div className="bg-white rounded-2xl border border-[#edeceb] p-6 flex flex-wrap gap-6">
        {(Object.entries(tokens.borderRadius) as [string, string][]).map(([key, value]) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <div
              className="w-12 h-12 bg-[#eadbfa] border-2 border-[#7237ae]/30"
              style={{ borderRadius: value }}
            />
            <span className="text-xs font-mono text-[#242320]">{key}</span>
            <span className="text-xs text-[#78736f]">{value}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Shadows */}
    <section className="mb-10">
      <h2 className="text-sm font-semibold text-[#78736f] uppercase tracking-wider mb-4">Shadows</h2>
      <div className="bg-white rounded-2xl border border-[#edeceb] p-6 flex flex-wrap gap-8">
        {(Object.keys(tokens.shadows) as (keyof typeof tokens.shadows)[]).map((key) => (
          <div key={key} className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-xl" style={{ boxShadow: tokens.shadows[key] }} />
            <span className="text-xs font-mono text-[#242320]">{key}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Typography tokens */}
    <section>
      <h2 className="text-sm font-semibold text-[#78736f] uppercase tracking-wider mb-4">Typography</h2>
      <div className="bg-white rounded-2xl border border-[#edeceb] p-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[#78736f] mb-1">Heading</p>
          <p className="text-sm font-mono text-[#242320]">Geist</p>
        </div>
        <div>
          <p className="text-xs text-[#78736f] mb-1">Body</p>
          <p className="text-sm font-mono text-[#242320]">Inter</p>
        </div>
        <div>
          <p className="text-xs text-[#78736f] mb-1">Sizes</p>
          <p className="text-sm font-mono text-[#242320]">
            {Object.values(tokens.typography.size).join(' · ')}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#78736f] mb-1">Weights</p>
          <p className="text-sm font-mono text-[#242320]">
            {Object.values(tokens.typography.weight).join(' · ')}
          </p>
        </div>
      </div>
    </section>
  </div>
);

const meta: Meta = {
  title: 'Design System/Tokens',
  component: TokensOverview,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {};
