import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from '../src/components/field'

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Field>

export const Default: Story = {
  args: { label: 'Symbol', children: null },
  render: (args) => (
    <Field {...args}>
      <input
        className="h-10 w-full bg-background border border-border px-3 text-sm font-mono text-foreground"
        placeholder="BTC/USD"
      />
    </Field>
  ),
}

export const WithError: Story = {
  render: () => (
    <Field label="Amount" error="Amount is required" required>
      <input className="h-10 w-full bg-background border border-error px-3 text-sm font-mono text-foreground" />
    </Field>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <Field label="API Key" description="Your Alpaca API key">
      <input
        className="h-10 w-full bg-background border border-border px-3 text-sm font-mono text-foreground"
        placeholder="pk_..."
      />
    </Field>
  ),
}
