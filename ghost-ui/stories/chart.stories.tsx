import type { Meta, StoryObj } from '@storybook/react-vite'
import { LineChart, Sparkline, BarChart, AreaChart } from '../src/components/chart'

const meta: Meta = {
  title: 'Components/Chart',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

const priceData = [142, 145, 138, 152, 148, 155, 160, 158, 165, 170, 168, 175]
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const Line: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <LineChart
        series={[
          { label: 'AAPL', data: priceData, variant: 'cyan' },
          { label: 'MSFT', data: [380, 390, 385, 400, 395, 410, 420, 415, 430, 440, 435, 445].map(v => v / 2.5), variant: 'purple' },
        ]}
        labels={labels}
        height={240}
        showDots
        showGrid
        showArea
      />
    </div>
  ),
}

export const SparklineDemo: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-foreground-dim">AAPL</span>
        <Sparkline data={priceData} variant="cyan" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-foreground-dim">TSLA</span>
        <Sparkline data={[240, 235, 250, 245, 260, 255, 270, 265, 280, 275, 290, 285]} variant="green" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-foreground-dim">NVDA</span>
        <Sparkline data={[800, 820, 810, 850, 840, 870, 880, 860, 900, 920, 910, 950]} variant="purple" />
      </div>
    </div>
  ),
}

export const Bar: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <BarChart
        data={[
          { label: 'Mon', value: 45, variant: 'cyan' },
          { label: 'Tue', value: 72, variant: 'cyan' },
          { label: 'Wed', value: 58, variant: 'cyan' },
          { label: 'Thu', value: 90, variant: 'green' },
          { label: 'Fri', value: 35, variant: 'red' },
        ]}
        height={200}
      />
    </div>
  ),
}

export const Area: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <AreaChart data={priceData} height={160} variant="cyan" />
    </div>
  ),
}
