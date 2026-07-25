import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover, PopoverTrigger, PopoverContent } from '../src/components/popover'
import { Button } from '../src/components/button'
import { Input } from '../src/components/input'
import { Label } from '../src/components/label'

const meta: Meta<typeof Popover> = {
  title: 'Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <Popover>
        <PopoverTrigger>
          <Button variant="outline">OPEN POPOVER</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-wider text-foreground-bright">
              Settings
            </p>
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input placeholder="Enter name..." />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input placeholder="Enter email..." />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
}

export const TopPlacement: Story = {
  render: () => (
    <div className="flex items-center justify-center p-40">
      <Popover>
        <PopoverTrigger>
          <Button>TOP POPOVER</Button>
        </PopoverTrigger>
        <PopoverContent placement="top">
          <p className="text-xs text-foreground-dim">Content appears above the trigger</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
}
