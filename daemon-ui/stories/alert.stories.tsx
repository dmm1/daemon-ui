import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, AlertTitle, AlertDescription } from '../src/components/alert'

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>System Notice</AlertTitle>
      <AlertDescription>Trading session will restart at midnight UTC.</AlertDescription>
    </Alert>
  ),
}

export const Info: Story = {
  render: () => (
    <Alert variant="info">
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>Market data is delayed by 15 minutes.</AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <AlertTitle>Order Filled</AlertTitle>
      <AlertDescription>Buy 0.5 BTC at $42,150.00</AlertDescription>
    </Alert>
  ),
}

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <AlertTitle>High Volatility</AlertTitle>
      <AlertDescription>VIX is above threshold. Position sizing reduced.</AlertDescription>
    </Alert>
  ),
}

export const Error: Story = {
  render: () => (
    <Alert variant="error">
      <AlertTitle>Circuit Breaker</AlertTitle>
      <AlertDescription>Daily loss limit reached. Trading halted.</AlertDescription>
    </Alert>
  ),
}
