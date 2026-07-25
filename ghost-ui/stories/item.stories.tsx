import type { Meta, StoryObj } from '@storybook/react-vite'
import { Item } from '../src/components/item'

const meta: Meta<typeof Item> = {
  title: 'Components/Item',
  component: Item,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Item>

export const Default: Story = {
  args: { children: 'BTC/USD' },
}

export const WithLeadingTrailing: Story = {
  args: {
    leading: <span className="text-success">●</span>,
    children: 'ETH/USD',
    trailing: <span className="text-foreground-dim text-xs">$3,215.40</span>,
  },
}

export const Selected: Story = {
  args: {
    children: 'SOL/USD',
    selected: true,
    leading: <span className="text-primary">●</span>,
  },
}

export const Disabled: Story = {
  args: { children: 'DOGE/USD', disabled: true },
}

export const Clickable: Story = {
  args: {
    children: 'Click me',
    onClick: () => alert('clicked'),
  },
}
