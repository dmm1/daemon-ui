import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from '../src/context/theme-provider'
import '../src/styles/index.css'

const preview: Preview = {
  parameters: {
    backgrounds: { disabled: true },
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'system', title: 'System', icon: 'browser' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [
    (Story, context) => (
      <ThemeProvider defaultTheme={context.globals.theme || 'dark'}>
        <div className="p-8 min-h-[200px] flex items-center justify-center">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}

export default preview
