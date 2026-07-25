import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast, Toaster } from '../src/components/toast'
import { Button } from '../src/components/button'

const meta: Meta = {
  title: 'Overlays/Toast',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-8">
      <Toaster />
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={() =>
            toast({ title: 'Order Placed', description: 'BUY 100 AAPL @ $182.52' })
          }
        >
          DEFAULT TOAST
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.success('Trade Executed', { description: 'Position opened successfully' })
          }
        >
          SUCCESS
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error('Order Failed', { description: 'Insufficient buying power' })
          }
        >
          ERROR
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning('Circuit Breaker', { description: 'Daily loss limit approaching' })
          }
        >
          WARNING
        </Button>
      </div>
    </div>
  ),
}

export const CustomDuration: Story = {
  render: () => (
    <div className="p-8">
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: 'Persistent',
            description: 'This toast stays for 10 seconds',
            duration: 10000,
          })
        }
      >
        LONG TOAST
      </Button>
    </div>
  ),
}
