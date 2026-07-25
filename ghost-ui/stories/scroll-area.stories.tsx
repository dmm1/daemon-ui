import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea } from '../src/components/scroll-area'

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ScrollArea>

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[300px] border border-border">
      <div className="p-4">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="py-1 text-xs font-mono text-foreground">
            ITEM {String(i + 1).padStart(3, '0')} — System log entry
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea orientation="horizontal" className="w-[300px] border border-border">
      <div className="flex gap-4 p-4 w-[800px]">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="flex h-16 w-16 shrink-0 items-center justify-center border border-border text-xs font-mono text-foreground"
          >
            {String(i + 1).padStart(2, '0')}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}
