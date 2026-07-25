import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipContent } from '../src/components/tooltip'
import { Button } from '../src/components/button'

const meta: Meta<typeof Tooltip> = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Tooltip content="Simple tooltip text" placement="top">
        <Button variant="outline">HOVER ME</Button>
      </Tooltip>
    </div>
  ),
}

export const Bottom: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Tooltip content="Bottom placement" placement="bottom">
        <Button variant="outline">BOTTOM</Button>
      </Tooltip>
    </div>
  ),
}

export const RichContent: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Tooltip
        placement="bottom"
        content={
          <TooltipContent
            title="AAPL"
            items={[
              { label: 'Price', value: '$182.52' },
              { label: 'Change', value: '+1.23%' },
              { label: 'Volume', value: '52.3M' },
            ]}
            description="Last updated 2s ago"
          />
        }
      >
        <Button>VIEW DETAILS</Button>
      </Tooltip>
    </div>
  ),
}

export const Placements: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-4 p-20">
      <Tooltip content="Top" placement="top">
        <Button variant="outline" size="sm">TOP</Button>
      </Tooltip>
      <Tooltip content="Right" placement="right">
        <Button variant="outline" size="sm">RIGHT</Button>
      </Tooltip>
      <Tooltip content="Bottom" placement="bottom">
        <Button variant="outline" size="sm">BOTTOM</Button>
      </Tooltip>
      <Tooltip content="Left" placement="left">
        <Button variant="outline" size="sm">LEFT</Button>
      </Tooltip>
    </div>
  ),
}
