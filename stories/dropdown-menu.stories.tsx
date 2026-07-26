import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../src/components/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '../src/components/dropdown-menu'

const meta: Meta = {
  title: 'Navigation/DropdownMenu',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">OPEN MENU</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>ACTIONS</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>New File</DropdownMenuItem>
          <DropdownMenuItem>Open File</DropdownMenuItem>
          <DropdownMenuItem>Save</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Exit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const WithOnSelect: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>ACTIONS</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => alert('Copy')}>Copy</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => alert('Paste')}>
          Paste
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => alert('Delete')}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const AlignEnd: Story = {
  render: () => (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline">ALIGN END</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Option A</DropdownMenuItem>
          <DropdownMenuItem>Option B</DropdownMenuItem>
          <DropdownMenuItem>Option C</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}
