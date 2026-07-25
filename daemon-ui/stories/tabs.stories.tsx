import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../src/components/tabs'

const meta: Meta = {
  title: 'Navigation/Tabs',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="text-xs font-mono text-foreground p-4 border border-border">
          Overview content panel. Displays general system information.
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="text-xs font-mono text-foreground p-4 border border-border">
          Analytics dashboard with metrics and charts.
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="text-xs font-mono text-foreground p-4 border border-border">
          Generated reports and data exports.
        </div>
      </TabsContent>
    </Tabs>
  ),
}
