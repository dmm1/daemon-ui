import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../src/components/dialog'
import { Button } from '../src/components/button'
import { Input } from '../src/components/input'
import { Label } from '../src/components/label'

const meta: Meta<typeof Dialog> = {
  title: 'Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button>OPEN DIALOG</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 my-4">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input defaultValue="Daemon UI Agent" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>API Key</Label>
            <Input type="password" defaultValue="sk-..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">CANCEL</Button>
          <Button>SAVE</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Simple: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">INFO</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>System Status</DialogTitle>
          <DialogDescription>
            All systems operational. Last check: 2s ago.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
