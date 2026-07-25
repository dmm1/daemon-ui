import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '../src/components/textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = { args: { placeholder: 'Enter text...' } }
export const WithValue: Story = { args: { defaultValue: 'Some content here' } }
export const AutoResize: Story = { args: { autoResize: true, placeholder: 'Type to auto-resize...' } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Disabled textarea' } }
