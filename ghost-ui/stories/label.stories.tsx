import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '../src/components/label'

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = { args: { children: 'AMOUNT' } }
export const Required: Story = { args: { children: 'API KEY', required: true } }
