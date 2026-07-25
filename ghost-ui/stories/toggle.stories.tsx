import type { Meta, StoryObj } from '@storybook/react'
import { Toggle } from '../src/components/toggle'

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = { args: { children: 'TOGGLE', pressed: false } }
export const Pressed: Story = { args: { children: 'ACTIVE', pressed: true } }
export const Outline: Story = { args: { variant: 'outline', children: 'OUTLINE' } }
export const Small: Story = { args: { size: 'sm', children: 'SM' } }
export const Large: Story = { args: { size: 'lg', children: 'LG' } }
export const Disabled: Story = { args: { disabled: true, children: 'DISABLED' } }
