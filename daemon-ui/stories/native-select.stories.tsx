import type { Meta, StoryObj } from '@storybook/react-vite'
import { NativeSelect } from '../src/components/native-select'

const meta: Meta<typeof NativeSelect> = {
  title: 'Components/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof NativeSelect>

export const Default: Story = {
  render: (args) => (
    <NativeSelect {...args}>
      <option value="btc">BTC/USD</option>
      <option value="eth">ETH/USD</option>
      <option value="sol">SOL/USD</option>
    </NativeSelect>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <NativeSelect disabled {...args}>
      <option>Disabled</option>
    </NativeSelect>
  ),
}
