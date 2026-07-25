import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DatePicker } from '../src/components/date-picker'

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    return <DatePicker value={date} onChange={setDate} className="w-64" />
  },
}

export const WithValue: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return <DatePicker value={date} onChange={setDate} className="w-64" />
  },
}
