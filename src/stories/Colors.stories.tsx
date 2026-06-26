import type { Meta, StoryObj } from '@storybook/nextjs';
import { colors, colorGroups } from '@/lib/tokens';

const ColorSwatch = ({ name, value }: { name: string; value: string }) => (
  <div className="flex flex-col items-center gap-2 w-24">
    <div
      className="w-16 h-16 rounded-xl border border-[#edeceb]"
      style={{ backgroundColor: value }}
    />
    <div className="text-center">
      <p className="text-[11px] font-medium text-[#242320] leading-tight">{name}</p>
      <p className="text-[11px] text-[#78736f] font-mono">{value}</p>
    </div>
  </div>
);

const ColorPalette = () => (
  <div className="p-8 bg-[#fbfbfa] min-h-screen">
    <h1 className="text-2xl font-bold text-[#242320] mb-1">Cores</h1>
    <p className="text-sm text-[#78736f] mb-8">Tokens semânticos extraídos do Figma.</p>

    {colorGroups.map((group) => (
      <section className="mb-8" key={group.name}>
        <h2 className="text-sm font-semibold text-[#78736f] uppercase tracking-wider mb-4">
          {group.name}
        </h2>
        <div className="flex flex-wrap gap-5">
          {group.tokens.map(({ key, label }) => (
            <ColorSwatch key={key} name={label} value={colors[key]} />
          ))}
        </div>
      </section>
    ))}
  </div>
);

const meta: Meta = {
  title: 'Design System/Cores',
  component: ColorPalette,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Palette: Story = {};
