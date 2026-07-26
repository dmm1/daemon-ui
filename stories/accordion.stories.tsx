import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../src/components/accordion'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Accordion>

export const Single: Story = {
  render: () => (
    <Accordion type="single" className="w-80">
      <AccordionItem value="1">
        <AccordionTrigger>Positions</AccordionTrigger>
        <AccordionContent>
          3 open positions with $12,450 total exposure.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger>Risk Metrics</AccordionTrigger>
        <AccordionContent>
          Daily PnL: +$340. Max drawdown: 1.2%.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionTrigger>Strategy Config</AccordionTrigger>
        <AccordionContent>
          Momentum + Pairs active. Arbitrage paused.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['a', 'b']} className="w-80">
      <AccordionItem value="a">
        <AccordionTrigger>Alpha</AccordionTrigger>
        <AccordionContent>Alpha content expanded by default.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Beta</AccordionTrigger>
        <AccordionContent>Beta content also expanded.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
