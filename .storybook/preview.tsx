import type { Preview } from '@storybook/nextjs';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'cream',
      values: [
        { name: 'cream', value: '#F5F5F0' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'navy', value: '#0D2137' },
        { name: 'light-blue', value: '#E8F0F7' },
      ],
    },
    layout: 'centered',
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile (390px)',
          styles: { width: '390px', height: '844px' },
        },
      },
      defaultViewport: 'mobile',
    },
  },
};

export default preview;
