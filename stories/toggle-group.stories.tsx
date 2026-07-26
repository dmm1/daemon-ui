import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleGroup, ToggleGroupItem } from '../src/components/toggle-group'

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ToggleGroup>

export const Single: Story = {
  args: { type: 'single', value: 'a' },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Multiple: Story = {
  args: { type: 'multiple', value: ['a', 'c'] },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="a">BOLD</ToggleGroupItem>
      <ToggleGroupItem value="b">ITALIC</ToggleGroupItem>
      <ToggleGroupItem value="c">UNDER</ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Outline: Story = {
  args: { type: 'single', value: 'b' },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="a" variant="outline">
        X
      </ToggleGroupItem>
      <ToggleGroupItem value="b" variant="outline">
        Y
      </ToggleGroupItem>
      <ToggleGroupItem value="c" variant="outline">
        Z
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}
