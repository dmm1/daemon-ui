import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  CommandEmpty,
  CommandDialog,
} from '../src/components/command'
import { Button } from '../src/components/button'

const meta: Meta = {
  title: 'Navigation/Command',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Command className="max-w-md" onSelect={(v) => alert(`Selected: ${v}`)}>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar">Calendar</CommandItem>
          <CommandItem value="search">Search</CommandItem>
          <CommandItem value="settings">Settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="new-file">New File</CommandItem>
          <CommandItem value="new-folder">New Folder</CommandItem>
          <CommandItem value="export">Export Data</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

function DialogDemo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>OPEN COMMAND PALETTE</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command onSelect={(v) => { alert(`Selected: ${v}`); setOpen(false) }}>
          <CommandInput placeholder="Search commands..." />
          <CommandList>
            <CommandEmpty>Nothing found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem value="home">Home</CommandItem>
              <CommandItem value="dashboard">Dashboard</CommandItem>
              <CommandItem value="settings">Settings</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tools">
              <CommandItem value="terminal">Terminal</CommandItem>
              <CommandItem value="debugger">Debugger</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export const Dialog: Story = {
  render: () => <DialogDemo />,
}
