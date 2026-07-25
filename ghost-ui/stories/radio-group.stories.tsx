import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup, RadioGroupItem } from '../src/components/radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  args: { value: 'a' },
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" />
        <span className="text-sm font-mono text-foreground">Option A</span>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" />
        <span className="text-sm font-mono text-foreground">Option B</span>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="c" />
        <span className="text-sm font-mono text-foreground">Option C</span>
      </div>
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  args: { value: 'b', orientation: 'horizontal' },
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" />
        <span className="text-sm font-mono">A</span>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" />
        <span className="text-sm font-mono">B</span>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="c" />
        <span className="text-sm font-mono">C</span>
      </div>
    </RadioGroup>
  ),
}
