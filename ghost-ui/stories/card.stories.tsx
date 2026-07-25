import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../src/components/card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current trading engine metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs font-mono space-y-2">
          <div className="flex justify-between">
            <span className="text-foreground-dim">Uptime</span>
            <span className="text-success">99.7%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-dim">Latency</span>
            <span>12ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-dim">Orders/min</span>
            <span>847</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <span className="text-[10px] font-mono text-foreground-dim">Last updated: 2s ago</span>
      </CardFooter>
    </Card>
  ),
}

export const Minimal: Story = {
  render: () => (
    <Card className="w-64">
      <CardContent>
        <p className="text-xs font-mono">Content-only card without header or footer.</p>
      </CardContent>
    </Card>
  ),
}
