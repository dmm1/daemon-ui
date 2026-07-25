import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../src/components/badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = { args: { children: 'ACTIVE' } }
export const Success: Story = { args: { variant: 'success', children: 'PROFIT' } }
export const Warning: Story = { args: { variant: 'warning', children: 'PENDING' } }
export const Error: Story = { args: { variant: 'error', children: 'LOSS' } }
export const Outline: Story = { args: { variant: 'outline', children: 'NEUTRAL' } }
