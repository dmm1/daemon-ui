import type { Meta, StoryObj } from '@storybook/react'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '../src/components/sidebar'

const meta: Meta = {
  title: 'Components/Sidebar',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

const DashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="8" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="1" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="8" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const ChartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <polyline points="1,10 4,6 7,8 13,2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
)

const GearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <div className="relative h-96 bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-[0.15em] text-foreground-dim">MAHORAGA</span>
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<DashIcon />} active>
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<ChartIcon />}>
                  Positions
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<GearIcon />}>
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <span className="text-[10px] font-mono text-foreground-dim">v0.1.0</span>
          </SidebarFooter>
        </Sidebar>
      </div>
    </SidebarProvider>
  ),
}

export const Collapsed: Story = {
  render: () => (
    <SidebarProvider defaultExpanded={false}>
      <div className="relative h-96 bg-background">
        <Sidebar>
          <SidebarHeader>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<DashIcon />} active />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<ChartIcon />} />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<GearIcon />} />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  ),
}
