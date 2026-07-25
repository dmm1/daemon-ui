import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '../src/components/sheet'
import { Button } from '../src/components/button'
import { Input } from '../src/components/input'
import { Label } from '../src/components/label'

const meta: Meta<typeof Sheet> = {
  title: 'Overlays/Sheet',
  component: Sheet,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Sheet>

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">OPEN SHEET</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Configuration</SheetTitle>
          <SheetDescription>Adjust your trading parameters.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 my-4">
          <div className="flex flex-col gap-2">
            <Label>Max Position Size</Label>
            <Input defaultValue="1000" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Stop Loss %</Label>
            <Input defaultValue="2" />
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline">CANCEL</Button>
          <Button>SAVE</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">LEFT SHEET</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Menu items</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-4">
          {['Dashboard', 'Positions', 'History', 'Settings'].map((item) => (
            <button
              key={item}
              className="text-left text-xs font-mono text-foreground-dim hover:text-foreground py-2 px-3 transition-all"
            >
              {item.toUpperCase()}
            </button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  ),
}

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">BOTTOM SHEET</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
        </SheetHeader>
        <div className="flex gap-2 py-4">
          <Button size="sm">BUY</Button>
          <Button size="sm" variant="destructive">SELL</Button>
          <Button size="sm" variant="outline">CLOSE ALL</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
}
