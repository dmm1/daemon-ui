import type { Meta, StoryObj } from '@storybook/react'
import { InputOTP } from '../src/components/input-otp'

const meta: Meta<typeof InputOTP> = {
  title: 'Components/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof InputOTP>

export const FourDigits: Story = {
  args: { maxLength: 4 },
}

export const SixDigits: Story = {
  args: { maxLength: 6 },
}

export const WithValue: Story = {
  args: { maxLength: 4, value: '1234' },
}

export const Disabled: Story = {
  args: { maxLength: 4, disabled: true, value: '00' },
}
