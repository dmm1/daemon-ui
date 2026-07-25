import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from '../src/components/slider'

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = { args: { value: 50 } }
export const Empty: Story = { args: { value: 0 } }
export const Full: Story = { args: { value: 100 } }
export const Stepped: Story = { args: { value: 60, step: 20 } }
export const Disabled: Story = { args: { value: 40, disabled: true } }
