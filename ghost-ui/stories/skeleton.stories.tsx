import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from '../src/components/skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = { args: { width: 200, height: 20 } }
export const Circle: Story = {
  args: { width: 40, height: 40, className: 'rounded-full' },
}
export const Card: Story = {
  args: { width: '100%', height: 120 },
}
