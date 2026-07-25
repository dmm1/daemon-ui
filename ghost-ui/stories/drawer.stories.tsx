import type { Meta, StoryObj } from '@storybook/react'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '../src/components/drawer'
import { Button } from '../src/components/button'

const meta: Meta<typeof Drawer> = {
  title: 'Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Drawer>

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger>
        <Button variant="outline">OPEN DRAWER</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Order Details</DrawerTitle>
          <DrawerDescription>Drag down to dismiss</DrawerDescription>
        </DrawerHeader>
        <div className="px-6 py-4 flex flex-col gap-3">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-foreground-dim">Symbol</span>
            <span className="text-foreground">AAPL</span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-foreground-dim">Side</span>
            <span className="text-success">BUY</span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-foreground-dim">Quantity</span>
            <span className="text-foreground">100</span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-foreground-dim">Price</span>
            <span className="text-foreground">$182.52</span>
          </div>
        </div>
        <DrawerFooter>
          <Button variant="outline">CANCEL</Button>
          <Button>CONFIRM ORDER</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
