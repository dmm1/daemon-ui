import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../src/components/hover-card'

const meta: Meta<typeof HoverCard> = {
  title: 'Overlays/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof HoverCard>

export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center p-20">
      <HoverCard>
        <HoverCardTrigger>
          <span className="text-primary underline underline-offset-4 font-mono text-sm cursor-pointer">
            @ghost_ui
          </span>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-mono uppercase tracking-wider text-foreground-bright">
              GHOST RIDER
            </p>
            <p className="text-xs text-foreground-dim">
              Autonomous trading agent powered by LLM analysis. Running on Cloudflare Workers.
            </p>
            <div className="flex gap-4 text-[10px] text-foreground-dim">
              <span>24 trades</span>
              <span>+12.4% PnL</span>
              <span>Since Jan 2025</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
}

export const TopPlacement: Story = {
  render: () => (
    <div className="flex items-center justify-center p-40">
      <HoverCard>
        <HoverCardTrigger>
          <span className="text-primary font-mono text-sm cursor-pointer">Hover for info</span>
        </HoverCardTrigger>
        <HoverCardContent placement="top">
          <p className="text-xs text-foreground-dim">This card appears above the trigger.</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
}
