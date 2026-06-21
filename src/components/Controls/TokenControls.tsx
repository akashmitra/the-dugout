import { useBoardStore } from '../../store/useBoardStore'

const TRACK_COLOR = 'rgba(255,255,255,0.08)'
const THUMB_COLOR = '#03b16b'

const sliderStyle: React.CSSProperties = {
  WebkitAppearance: 'none',
  appearance: 'none',
  width: '100%',
  height: 3,
  borderRadius: 99,
  background: TRACK_COLOR,
  outline: 'none',
  cursor: 'pointer',
}

interface SliderGroupProps {
  label: string
  icon: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  formatValue: (v: number) => string
  align: 'left' | 'right'
}

function SliderGroup({ label, icon, value, min, max, step, onChange, formatValue, align }: SliderGroupProps) {
  const pct = ((value - min) / (max - min)) * 100
  const trackBg = `linear-gradient(to right, ${THUMB_COLOR} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        gap: 5,
      }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {icon} {label}
        </span>
        <span style={{
          fontSize: 9, fontWeight: 700, color: '#03b16b',
          background: 'rgba(3,177,107,0.1)', padding: '1px 5px',
          borderRadius: 3, letterSpacing: '0.04em',
        }}>
          {formatValue(value)}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ ...sliderStyle, background: trackBg }}
      />
    </div>
  )
}

interface TeamControlsProps {
  slot: 'A' | 'B'
  align: 'left' | 'right'
  primaryColor: string
  size: number
  opacity: number
  onSize: (v: number) => void
  onOpacity: (v: number) => void
}

function TeamControls({ slot, align, primaryColor, size, opacity, onSize, onOpacity }: TeamControlsProps) {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', gap: 12,
      flexDirection: align === 'right' ? 'row-reverse' : 'row',
      minWidth: 0,
    }}>
      {/* Color dot */}
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: primaryColor,
        flexShrink: 0,
        boxShadow: `0 0 0 1.5px rgba(0,0,0,0.4), 0 0 6px ${primaryColor}55`,
      }} />

      <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 0 }}>
        <SliderGroup
          label="Size" icon="⬡"
          value={size} min={18} max={52} step={2}
          onChange={onSize}
          formatValue={v => `${v}px`}
          align={align}
        />
        <SliderGroup
          label="Opacity" icon="◑"
          value={Math.round(opacity * 100)} min={20} max={100} step={5}
          onChange={v => onOpacity(v / 100)}
          formatValue={v => `${v}%`}
          align={align}
        />
      </div>
    </div>
  )
}

export function TokenControls() {
  const teamA = useBoardStore(s => s.teamA)
  const teamB = useBoardStore(s => s.teamB)
  const tokenSizeA = useBoardStore(s => s.tokenSizeA)
  const tokenOpacityA = useBoardStore(s => s.tokenOpacityA)
  const tokenSizeB = useBoardStore(s => s.tokenSizeB)
  const tokenOpacityB = useBoardStore(s => s.tokenOpacityB)
  const setTokenStyle = useBoardStore(s => s.setTokenStyle)

  if (!teamA && !teamB) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '0 20px',
      height: 42,
      background: '#141414',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      flexShrink: 0,
      gap: 0,
    }}>
      {/* Team A side */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden', paddingRight: 24 }}>
        {teamA ? (
          <TeamControls
            slot="A" align="left"
            primaryColor={teamA.primaryColor}
            size={tokenSizeA}
            opacity={tokenOpacityA}
            onSize={v => setTokenStyle('A', v, tokenOpacityA)}
            onOpacity={v => setTokenStyle('A', tokenSizeA, v)}
          />
        ) : <div style={{ flex: 1 }} />}
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />

      {/* Team B side */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden', paddingLeft: 24 }}>
        {teamB ? (
          <TeamControls
            slot="B" align="right"
            primaryColor={teamB.primaryColor}
            size={tokenSizeB}
            opacity={tokenOpacityB}
            onSize={v => setTokenStyle('B', v, tokenOpacityB)}
            onOpacity={v => setTokenStyle('B', tokenSizeB, v)}
          />
        ) : <div style={{ flex: 1 }} />}
      </div>
    </div>
  )
}
