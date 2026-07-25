import type { Meta, StoryObj } from '@storybook/react'
import { AspectRatio } from '../src/components/aspect-ratio'

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof AspectRatio>

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <AspectRatio ratio={16 / 9}>
        <div className="w-full h-full bg-background-panel border border-border flex items-center justify-center">
          <span className="text-xs font-mono text-foreground-dim">16:9</span>
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  render: () => (
    <div className="w-48">
      <AspectRatio ratio={1}>
        <div className="w-full h-full bg-background-panel border border-border flex items-center justify-center">
          <span className="text-xs font-mono text-foreground-dim">1:1</span>
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Ultrawide: Story = {
  render: () => (
    <div className="w-96">
      <AspectRatio ratio={21 / 9}>
        <div className="w-full h-full bg-background-panel border border-border flex items-center justify-center">
          <span className="text-xs font-mono text-foreground-dim">21:9</span>
        </div>
      </AspectRatio>
    </div>
  ),
}
