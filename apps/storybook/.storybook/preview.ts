import type { Preview } from '@storybook/react';
import '@zineddinebk09/grid-react/styles.css';
import '@zineddinebk09/grid-vue/styles.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'padded',
    a11y: { test: 'todo' },
  },
};

export default preview;
