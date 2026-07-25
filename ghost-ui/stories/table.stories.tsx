import type { Meta, StoryObj } from '@storybook/react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '../src/components/table'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Table>

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Recent trades</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Side</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>PnL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>AAPL</TableCell>
          <TableCell className="text-success">BUY</TableCell>
          <TableCell>100</TableCell>
          <TableCell>$178.42</TableCell>
          <TableCell className="text-success">+$234</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>TSLA</TableCell>
          <TableCell className="text-error">SELL</TableCell>
          <TableCell>50</TableCell>
          <TableCell>$242.10</TableCell>
          <TableCell className="text-error">-$87</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>NVDA</TableCell>
          <TableCell className="text-success">BUY</TableCell>
          <TableCell>25</TableCell>
          <TableCell>$875.30</TableCell>
          <TableCell className="text-success">+$1,240</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
