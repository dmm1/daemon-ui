import type { Meta, StoryObj } from '@storybook/react-vite'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../src/components/collapsible'

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: () => (
    <Collapsible className="w-80 border border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xs font-mono uppercase tracking-wider text-foreground-dim">Advanced Settings</span>
        <CollapsibleTrigger className="text-xs font-mono text-primary hover:text-primary/80 transition-colors">
          Toggle
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="px-4 pb-3 border-t border-border">
        <div className="space-y-2 pt-3">
          <p className="text-xs font-mono text-foreground-dim">Max position size: 5%</p>
          <p className="text-xs font-mono text-foreground-dim">Stop loss: 2%</p>
          <p className="text-xs font-mono text-foreground-dim">Take profit: 6%</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-80 border border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xs font-mono uppercase tracking-wider text-foreground-dim">Details</span>
        <CollapsibleTrigger className="text-xs font-mono text-primary">Toggle</CollapsibleTrigger>
      </div>
      <CollapsibleContent className="px-4 pb-3">
        Initially visible content.
      </CollapsibleContent>
    </Collapsible>
  ),
}
