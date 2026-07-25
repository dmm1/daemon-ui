import type { Meta, StoryObj } from '@storybook/react-vite'
import { ButtonGroup } from '../src/components/button-group'
import { Button } from '../src/components/button'

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ButtonGroup>

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">BUY</Button>
      <Button variant="outline">SELL</Button>
      <Button variant="outline">HOLD</Button>
    </ButtonGroup>
  ),
}

export const WithActive: Story = {
  render: () => (
    <ButtonGroup>
      <Button>1H</Button>
      <Button variant="outline">4H</Button>
      <Button variant="outline">1D</Button>
      <Button variant="outline">1W</Button>
    </ButtonGroup>
  ),
}
