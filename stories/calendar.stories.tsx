import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar } from '../src/components/calendar'

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date | undefined>()
    return (
      <div className="w-64 border border-border bg-background-panel">
        <Calendar selected={selected} onSelect={setSelected} />
        {selected && (
          <div className="px-3 pb-3 text-xs font-mono text-foreground-dim">
            Selected: {selected.toLocaleDateString()}
          </div>
        )}
      </div>
    )
  },
}

export const WithConstraints: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date | undefined>()
    const today = new Date()
    const maxDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    )
    return (
      <div className="w-64 border border-border bg-background-panel">
        <Calendar
          selected={selected}
          onSelect={setSelected}
          minDate={today}
          maxDate={maxDate}
        />
      </div>
    )
  },
}
