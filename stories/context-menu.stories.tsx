import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '../src/components/context-menu'

const meta: Meta = {
  title: 'Navigation/ContextMenu',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex h-[200px] w-[400px] items-center justify-center border border-dashed border-border text-xs font-mono text-foreground-dim">
          RIGHT-CLICK HERE
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => alert('Cut')}>Cut</ContextMenuItem>
        <ContextMenuItem onSelect={() => alert('Copy')}>Copy</ContextMenuItem>
        <ContextMenuItem onSelect={() => alert('Paste')}>Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Select All</ContextMenuItem>
        <ContextMenuItem disabled>Disabled</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}
