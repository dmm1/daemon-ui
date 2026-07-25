import type { Meta, StoryObj } from '@storybook/react-vite'
import { Empty } from '../src/components/empty'

const meta: Meta<typeof Empty> = {
  title: 'Components/Empty',
  component: Empty,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Empty>

export const Default: Story = {
  args: {
    title: 'No Positions',
    description: 'You have no open positions. Start trading to see them here.',
  },
}

export const WithAction: Story = {
  args: {
    title: 'No Data',
    description: 'Connect your API keys to begin.',
    action: <button className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-primary text-primary hover:bg-primary/10 transition-all">Configure</button>,
  },
}
