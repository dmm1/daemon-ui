import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Combobox } from '../src/components/combobox'

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Combobox>

const options = [
  { value: 'aapl', label: 'AAPL - Apple Inc.' },
  { value: 'tsla', label: 'TSLA - Tesla Inc.' },
  { value: 'nvda', label: 'NVDA - NVIDIA Corp.' },
  { value: 'msft', label: 'MSFT - Microsoft Corp.' },
  { value: 'amzn', label: 'AMZN - Amazon.com' },
  { value: 'meta', label: 'META - Meta Platforms' },
  { value: 'goog', label: 'GOOG - Alphabet Inc.' },
  { value: 'amd', label: 'AMD - Advanced Micro Devices' },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <Combobox
        options={options}
        value={value}
        onValueChange={setValue}
        placeholder="Search symbol..."
        searchPlaceholder="Type to filter..."
        className="w-64"
      />
    )
  },
}
