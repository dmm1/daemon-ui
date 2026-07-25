# daemon-ui

[![npm version](https://img.shields.io/npm/v/%40dmm1%2Fdaemon-ui.svg)](https://www.npmjs.com/package/@dmm1/daemon-ui)
[![license](https://img.shields.io/npm/l/%40dmm1%2Fdaemon-ui.svg)](https://github.com/dmm1/daemon-ui/blob/main/daemon-ui/LICENSE)

Dark HUD terminal-style component library for React 19. Built with Tailwind CSS 4, CVA, and Motion.

**The shadcn/ui for hackers.**

## Install

```bash
pnpm add @dmm1/daemon-ui
```

Peer dependencies:

```bash
pnpm add react react-dom tailwindcss
```

## Quick Start

```css
/* app.css */
@import "@dmm1/daemon-ui/styles";
```

```tsx
import { ThemeProvider, Button } from '@dmm1/daemon-ui'

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Button variant="default">EXECUTE</Button>
    </ThemeProvider>
  )
}
```

> Add `@source` in your CSS if using Tailwind 4 to scan daemon-ui components:
>
> ```css
> @source "../node_modules/@dmm1/daemon-ui/src";
> ```

## Theming

### Dark / Light / System

```tsx
<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>
```

### Custom Colors

```tsx
<ThemeProvider
  defaultTheme="dark"
  colors={{ primary: '#ff6b00' }}
  typography={{ fontMono: "'Fira Code', monospace" }}
>
  <App />
</ThemeProvider>
```

### useTheme Hook

```tsx
import { useTheme } from '@dmm1/daemon-ui'

function Toggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      {resolvedTheme === 'dark' ? 'LIGHT' : 'DARK'}
    </button>
  )
}
```

## 57+ Components

### Foundation

Button, Input, Label, Badge, Separator, Kbd, Spinner, Typography (H1-H6, P, Code, BlockQuote, Lead), Skeleton, Avatar, Progress

### Forms

Checkbox, Switch, RadioGroup, Slider, Textarea, Toggle, ToggleGroup, NativeSelect, Field, InputGroup, ButtonGroup, Alert, Empty, Item, InputOTP

### Overlays

Tooltip, Popover, HoverCard, Dialog, AlertDialog, Sheet, Drawer, Toast

### Navigation

DropdownMenu, ContextMenu, Menubar, NavigationMenu, Command, Tabs, Breadcrumb, Pagination, ScrollArea

### Data Display

Card, Accordion, Collapsible, Table, DataTable, Select, Combobox, Calendar, DatePicker, Carousel, Chart (LineChart, Sparkline, BarChart, AreaChart), Resizable, AspectRatio, Sidebar

### Primitives

Portal, FocusTrap, Dismissable, Popper

## Design Tokens

| Token | Dark | Light |
| ----- | ---- | ----- |
| `background` | `#11161d` | `#ffffff` |
| `background-panel` | `#0e1217` | `#f8f9fa` |
| `primary` | `#07edc7` | `#0891b2` |
| `foreground` | `#96a8c0` | `#1f2937` |
| `border` | `rgba(7,237,199,0.12)` | `#e5e7eb` |
| `success` | `#5cffcc` | `#10b981` |
| `warning` | `#eab308` | `#f59e0b` |
| `error` | `#ff6b6b` | `#ef4444` |
| `accent-cyan` | `#0ae5f5` | `#06b6d4` |
| `accent-purple` | `#2c4df0` | `#8b5cf6` |

## Storybook

```bash
pnpm storybook
```

## License

[MIT](LICENSE)
