import type { Preview } from '@storybook/react';
import '@zineddinebk/grid-react/styles.css';
import '@zineddinebk/grid-vue/styles.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'padded',
    a11y: { test: 'todo' },
  },
};

export default preview;
