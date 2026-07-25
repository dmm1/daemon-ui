import { useRef, useState } from 'react'
import { Portal } from '../src/primitives/portal'
import { FocusTrap } from '../src/primitives/focus-trap'
import { Dismissable } from '../src/primitives/dismissable'
import { Popper } from '../src/primitives/popper'

export default {
  title: 'Primitives',
  tags: ['autodocs'],
}

export function PortalDemo() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  return (
    <div>
      <p style={{ marginBottom: 8 }}>The text below is rendered via a Portal into the green box:</p>
      <div
        ref={setContainer}
        style={{
          border: '2px dashed #4ade80',
          padding: 16,
          borderRadius: 8,
          minHeight: 40,
          marginBottom: 8,
        }}
      />
      {container && (
        <Portal container={container}>
          <span style={{ color: '#4ade80' }}>I was portaled here!</span>
        </Portal>
      )}
    </div>
  )
}

export function FocusTrapDemo() {
  const [enabled, setEnabled] = useState(true)

  return (
    <div>
      <p style={{ marginBottom: 8 }}>
        Focus is trapped within the box. Press Escape to disable.
        Status: <strong>{enabled ? 'Trapped' : 'Released'}</strong>
      </p>
      <FocusTrap enabled={enabled} onEscape={() => setEnabled(false)}>
        <div
          style={{
            border: '2px solid #38bdf8',
            padding: 16,
            borderRadius: 8,
            display: 'flex',
            gap: 8,
          }}
        >
          <button style={{ padding: '4px 12px' }}>Button 1</button>
          <button style={{ padding: '4px 12px' }}>Button 2</button>
          <button style={{ padding: '4px 12px' }}>Button 3</button>
        </div>
      </FocusTrap>
      {!enabled && (
        <button
          onClick={() => setEnabled(true)}
          style={{ marginTop: 8, padding: '4px 12px' }}
        >
          Re-enable trap
        </button>
      )}
    </div>
  )
}

export function DismissableDemo() {
  const [visible, setVisible] = useState(true)

  return (
    <div>
      <p style={{ marginBottom: 8 }}>Click outside the blue box or press Escape to dismiss it.</p>
      {visible ? (
        <Dismissable onDismiss={() => setVisible(false)}>
          <div
            style={{
              border: '2px solid #818cf8',
              padding: 24,
              borderRadius: 8,
              background: 'rgba(129, 140, 248, 0.1)',
            }}
          >
            Click outside me or press Escape!
          </div>
        </Dismissable>
      ) : (
        <button onClick={() => setVisible(true)} style={{ padding: '4px 12px' }}>
          Show again
        </button>
      )}
    </div>
  )
}

export function PopperDemo() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <div style={{ padding: 64 }}>
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: '8px 16px',
          border: '1px solid #a78bfa',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        {open ? 'Hide' : 'Show'} Popper
      </button>
      <Popper referenceRef={buttonRef} open={open} placement="bottom" offset={8}>
        <div
          style={{
            background: '#1e1b4b',
            color: '#e0e7ff',
            padding: '8px 16px',
            borderRadius: 6,
            fontSize: 14,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          Positioned content
        </div>
      </Popper>
    </div>
  )
}
