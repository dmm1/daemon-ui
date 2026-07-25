import type { Meta, StoryObj } from '@storybook/react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../src/components/resizable'

const meta: Meta = {
  title: 'Components/Resizable',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Horizontal: Story = {
  render: () => (
    <div className="h-64 border border-border">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div className="h-full p-4 bg-background-panel">
            <span className="text-xs font-mono text-foreground-dim uppercase tracking-wider">Left Panel</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div className="h-full p-4">
            <span className="text-xs font-mono text-foreground-dim uppercase tracking-wider">Right Panel</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="h-64 border border-border">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>
          <div className="h-full p-4 bg-background-panel">
            <span className="text-xs font-mono text-foreground-dim uppercase tracking-wider">Top</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div className="h-full p-4">
            <span className="text-xs font-mono text-foreground-dim uppercase tracking-wider">Bottom</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}

export const ThreePanel: Story = {
  render: () => (
    <div className="h-64 border border-border">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div className="h-full p-4 bg-background-panel">
            <span className="text-xs font-mono text-foreground-dim">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle index={0} />
        <ResizablePanel>
          <div className="h-full p-4">
            <span className="text-xs font-mono text-foreground-dim">Main</span>
          </div>
        </ResizablePanel>
        <ResizableHandle index={1} />
        <ResizablePanel>
          <div className="h-full p-4 bg-background-panel">
            <span className="text-xs font-mono text-foreground-dim">Inspector</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}
