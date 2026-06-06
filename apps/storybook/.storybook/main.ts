import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx|vue)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      base: '/Open-Source-Data-Grid-Design-System/storybook/',
      plugins: [vue()],
      resolve: {
        alias: {
          '@zineddinebk09/grid-react': resolve(__dirname, '../../../packages/react/src'),
          '@zineddinebk09/grid-vue': resolve(__dirname, '../../../packages/vue/src'),
          '@zineddinebk09/grid-core': resolve(__dirname, '../../../packages/core/src'),
        },
      },
    });
  },
};

export default config;
