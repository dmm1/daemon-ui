import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectValue,
} from '../src/components/select'

const meta: Meta = {
  title: 'Components/Select',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select strategy..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="momentum">Momentum</SelectItem>
          <SelectItem value="pairs">Pairs Trading</SelectItem>
          <SelectItem value="arbitrage">Arbitrage</SelectItem>
          <SelectItem value="mean-rev">Mean Reversion</SelectItem>
        </SelectContent>
      </Select>
    )
  },
}

export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select asset..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup label="Equities">
            <SelectItem value="aapl">AAPL</SelectItem>
            <SelectItem value="tsla">TSLA</SelectItem>
          </SelectGroup>
          <SelectGroup label="Crypto">
            <SelectItem value="btc">BTC/USD</SelectItem>
            <SelectItem value="eth">ETH/USD</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  },
}
