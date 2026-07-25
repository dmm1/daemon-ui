import type { Meta, StoryObj } from '@storybook/react'
import { InputGroup, InputAddon } from '../src/components/input-group'

const meta: Meta<typeof InputGroup> = {
  title: 'Components/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof InputGroup>

export const WithPrefix: Story = {
  render: () => (
    <InputGroup>
      <InputAddon position="left">$</InputAddon>
      <input className="h-10 flex-1 bg-transparent px-3 text-sm font-mono text-foreground outline-none" placeholder="0.00" />
    </InputGroup>
  ),
}

export const WithSuffix: Story = {
  render: () => (
    <InputGroup>
      <input className="h-10 flex-1 bg-transparent px-3 text-sm font-mono text-foreground outline-none" placeholder="100" />
      <InputAddon position="right">USD</InputAddon>
    </InputGroup>
  ),
}

export const WithBoth: Story = {
  render: () => (
    <InputGroup>
      <InputAddon position="left">https://</InputAddon>
      <input className="h-10 flex-1 bg-transparent px-3 text-sm font-mono text-foreground outline-none" placeholder="example.com" />
      <InputAddon position="right">.com</InputAddon>
    </InputGroup>
  ),
}
