import type { Meta, StoryObj } from '@storybook/nextjs';
import { FeatureItem } from '@/components/ui/feature-item';

// Feature Item Stories
const FeatureItemMeta: Meta<typeof FeatureItem> = {
  title: 'Components/FeatureItem',
  component: FeatureItem,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'cream' },
  },
  args: {
    icon: '🎤',
    title: 'Crie por voz',
    subtitle: 'Fale para criar tarefas',
    iconBgColor: '#ffffff',
  },
};

export default FeatureItemMeta;

type Story = StoryObj<typeof FeatureItem>;

export const Voice: Story = {
  args: {
    icon: '🎤',
    title: 'Crie por voz',
    subtitle: 'Fale para criar tarefas',
    iconBgColor: '#ffffff',
  },
};

export const SharedTasks: Story = {
  args: {
    icon: '👥',
    title: 'Tarefas compartilhadas',
    subtitle: 'Planeje com outras pessoas',
    iconBgColor: '#E8F0F7',
  },
};

export const Agenda: Story = {
  args: {
    icon: '📅',
    title: 'Sintonize sua agenda',
    subtitle: 'Conecte seus compromissos',
    iconBgColor: '#F0FDF4',
  },
};

export const AllFeatureItems: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <FeatureItem
        icon="🎤"
        title="Crie por voz"
        subtitle="Fale para criar tarefas"
        iconBgColor="#ffffff"
      />
      <FeatureItem
        icon="👥"
        title="Tarefas compartilhadas"
        subtitle="Planeje com outras pessoas"
        iconBgColor="#ffffff"
      />
      <FeatureItem
        icon="📅"
        title="Sintonize sua agenda"
        subtitle="Conecte seus compromissos"
        iconBgColor="#ffffff"
      />
    </div>
  ),
};
