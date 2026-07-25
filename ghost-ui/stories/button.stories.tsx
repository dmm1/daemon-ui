import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../src/components/button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = { args: { children: 'BUTTON' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'GHOST' } }
export const Outline: Story = { args: { variant: 'outline', children: 'OUTLINE' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'DELETE' } }
export const Link: Story = { args: { variant: 'link', children: 'LINK' } }
export const Small: Story = { args: { size: 'sm', children: 'SMALL' } }
export const Large: Story = { args: { size: 'lg', children: 'LARGE' } }
export const Disabled: Story = { args: { disabled: true, children: 'DISABLED' } }
