import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from '../src/components/switch'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = { args: { checked: false } }
export const Checked: Story = { args: { checked: true } }
export const Small: Story = { args: { size: 'sm' } }
export const SmallChecked: Story = { args: { size: 'sm', checked: true } }
export const Disabled: Story = { args: { disabled: true } }
