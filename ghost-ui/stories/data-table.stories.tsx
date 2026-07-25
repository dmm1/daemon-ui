import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataTable } from '../src/components/data-table'

interface Trade {
  symbol: string
  side: string
  qty: number
  price: number
  pnl: number
}

const data: Trade[] = [
  { symbol: 'AAPL', side: 'BUY', qty: 100, price: 178.42, pnl: 234 },
  { symbol: 'TSLA', side: 'SELL', qty: 50, price: 242.10, pnl: -87 },
  { symbol: 'NVDA', side: 'BUY', qty: 25, price: 875.30, pnl: 1240 },
  { symbol: 'MSFT', side: 'BUY', qty: 75, price: 415.20, pnl: 156 },
  { symbol: 'AMZN', side: 'SELL', qty: 30, price: 185.50, pnl: -42 },
  { symbol: 'META', side: 'BUY', qty: 40, price: 505.80, pnl: 890 },
  { symbol: 'GOOG', side: 'SELL', qty: 20, price: 141.20, pnl: 67 },
  { symbol: 'AMD', side: 'BUY', qty: 60, price: 172.30, pnl: -120 },
]

const columns = [
  { key: 'symbol', header: 'Symbol', sortable: true },
  { key: 'side', header: 'Side', sortable: true, render: (r: Trade) => (
    <span className={r.side === 'BUY' ? 'text-success' : 'text-error'}>{r.side}</span>
  )},
  { key: 'qty', header: 'Qty', sortable: true },
  { key: 'price', header: 'Price', sortable: true, render: (r: Trade) => `$${r.price.toFixed(2)}` },
  { key: 'pnl', header: 'PnL', sortable: true, render: (r: Trade) => (
    <span className={r.pnl >= 0 ? 'text-success' : 'text-error'}>
      {r.pnl >= 0 ? '+' : ''}{r.pnl}
    </span>
  )},
]

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof DataTable>

export const Default: Story = {
  render: () => <DataTable data={data} columns={columns} />,
}

export const Searchable: Story = {
  render: () => <DataTable data={data} columns={columns} searchable />,
}

export const Paginated: Story = {
  render: () => <DataTable data={data} columns={columns} searchable paginated pageSize={3} />,
}
