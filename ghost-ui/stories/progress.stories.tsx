import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from '../src/components/progress'

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = { args: { value: 60 } }
export const Empty: Story = { args: { value: 0 } }
export const Full: Story = { args: { value: 100 } }
export const Success: Story = { args: { value: 75, color: 'success' } }
export const Warning: Story = { args: { value: 45, color: 'warning' } }
export const Error: Story = { args: { value: 20, color: 'error' } }
