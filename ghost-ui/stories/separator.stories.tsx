import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from '../src/components/separator'

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Separator>

export const Horizontal: Story = { args: { orientation: 'horizontal' } }
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  decorators: [
    (Story) => (
      <div style={{ height: 100 }}>
        <Story />
      </div>
    ),
  ],
}
