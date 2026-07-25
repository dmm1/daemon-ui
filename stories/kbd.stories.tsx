import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd } from '../src/components/kbd'

const meta: Meta<typeof Kbd> = {
  title: 'Components/Kbd',
  component: Kbd,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Kbd>

export const Default: Story = { args: { children: 'Ctrl+K' } }
export const Single: Story = { args: { children: 'Esc' } }
