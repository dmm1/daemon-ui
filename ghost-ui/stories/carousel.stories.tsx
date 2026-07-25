import type { Meta, StoryObj } from '@storybook/react-vite'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../src/components/carousel'

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Carousel>

export const Default: Story = {
  render: () => (
    <Carousel className="w-96">
      <CarouselContent>
        {['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN'].map((symbol) => (
          <CarouselItem key={symbol} className="w-48">
            <div className="border border-border bg-background-panel p-6 text-center">
              <div className="text-xs font-mono uppercase tracking-wider text-foreground-dim mb-2">{symbol}</div>
              <div className="text-lg font-mono text-foreground">${(Math.random() * 500 + 100).toFixed(2)}</div>
              <div className="text-xs font-mono text-success mt-1">+{(Math.random() * 5).toFixed(2)}%</div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const AutoPlay: Story = {
  render: () => (
    <Carousel autoPlay={3000} className="w-96">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((n) => (
          <CarouselItem key={n} className="w-96">
            <div className="border border-border bg-background-panel p-12 text-center">
              <span className="text-xs font-mono text-foreground-dim">Slide {n}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  ),
}
