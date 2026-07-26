import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../src/components/checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = { args: { checked: false } }
export const Checked: Story = { args: { checked: true } }
export const Indeterminate: Story = { args: { indeterminate: true } }
export const Disabled: Story = { args: { checked: false, disabled: true } }
export const DisabledChecked: Story = {
  args: { checked: true, disabled: true },
}
