import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '../src/components/input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = { args: { placeholder: 'Enter value...' } }
export const WithValue: Story = { args: { defaultValue: '0.0045 BTC' } }
export const Disabled: Story = { args: { placeholder: 'Disabled', disabled: true } }
export const Password: Story = { args: { type: 'password', placeholder: 'Password' } }
