import type { Meta, StoryObj } from '@storybook/nextjs';
import { colors } from '@/lib/tokens';

const ColorSwatch = ({
  name,
  value,
}: {
  name: string;
  value: string;
}) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className="w-16 h-16 rounded-xl shadow-sm border border-white/20"
      style={{ backgroundColor: value }}
    />
    <div className="text-center">
      <p className="text-xs font-semibold text-gray-800">{name}</p>
      <p className="text-xs text-gray-400 font-mono">{value}</p>
    </div>
  </div>
);

const ColorPalette = () => (
  <div className="p-6 bg-[#F5F5F0] min-h-screen">
    <h1 className="text-2xl font-bold text-[#0D2137] mb-8">Color Palette</h1>

    <section className="mb-8">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Brand Colors</h2>
      <div className="flex flex-wrap gap-6">
        <ColorSwatch name="Primary Navy" value={colors.primaryNavy} />
        <ColorSwatch name="Accent Yellow" value={colors.accentYellow} />
        <ColorSwatch name="Light Blue Bg" value={colors.lightBlueBg} />
        <ColorSwatch name="Cream" value={colors.cream} />
        <ColorSwatch name="White" value={colors.white} />
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Purple Scale</h2>
      <div className="flex flex-wrap gap-6">
        <ColorSwatch name="Purple Dark" value={colors.purpleDark} />
        <ColorSwatch name="Purple" value={colors.purple} />
        <ColorSwatch name="Purple Medium" value={colors.purpleMedium} />
        <ColorSwatch name="Purple Light" value={colors.purpleLight} />
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Neutrals</h2>
      <div className="flex flex-wrap gap-6">
        {(['gray100', 'gray200', 'gray300', 'gray400', 'gray500', 'gray600', 'gray700', 'gray800', 'gray900'] as const).map((key) => (
          <ColorSwatch key={key} name={key} value={colors[key]} />
        ))}
      </div>
    </section>

    <section className="mb-8">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Status</h2>
      <div className="flex flex-wrap gap-6">
        <ColorSwatch name="Success" value={colors.success} />
        <ColorSwatch name="Warning" value={colors.warning} />
        <ColorSwatch name="Error" value={colors.error} />
        <ColorSwatch name="Info" value={colors.info} />
      </div>
    </section>
  </div>
);

const meta: Meta = {
  title: 'Design System/Colors',
  component: ColorPalette,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Palette: Story = {};
