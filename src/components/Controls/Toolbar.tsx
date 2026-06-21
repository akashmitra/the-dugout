import { Copy, ImageDown, FileDown, Trash2 } from 'lucide-react'
import { useBoardStore } from '../../store/useBoardStore'
import { exportPNG } from '../../utils/exportPNG'
import { exportAllSlidesPDF } from '../../utils/exportPDF'

interface Props {
  boardRef: React.RefObject<HTMLElement | null>
}

const btnBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
  cursor: 'pointer', border: 'none', transition: 'all 0.15s',
  whiteSpace: 'nowrap', letterSpacing: '0.02em',
}

export function Toolbar({ boardRef }: Props) {
  const { activeSlideIndex, slides, duplicateSlide, deleteSlide, setActiveSlide } = useBoardStore()

  async function handleExportPNG() {
    if (boardRef.current) await exportPNG(boardRef.current, `tactics-${activeSlideIndex + 1}.png`)
  }

  async function handleExportPDF() {
    await exportAllSlidesPDF(() => boardRef.current, setActiveSlide, slides.length, 'tactics.pdf')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* Slide counter */}
      <span style={{
        fontSize: 11, color: 'rgba(255,255,255,0.35)', marginRight: 4,
        background: '#2c2c2c', padding: '3px 10px',
        borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
      }}>
        Slide {activeSlideIndex + 1} / {slides.length}
      </span>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />

      {/* Duplicate */}
      <button
        onClick={() => duplicateSlide(activeSlideIndex)}
        style={{ ...btnBase, background: '#03b16b', color: '#fff' }}
        title="Duplicate slide"
      >
        <Copy size={13} />
        Duplicate
      </button>

      {/* Delete */}
      <button
        onClick={() => deleteSlide(activeSlideIndex)}
        disabled={slides.length === 1}
        title="Delete slide"
        style={{ ...btnBase, background: '#2c2c2c', color: 'rgba(255,255,255,0.5)', padding: '6px 10px', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Trash2 size={13} />
      </button>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />

      {/* PNG */}
      <button
        onClick={handleExportPNG}
        style={{ ...btnBase, background: '#2c2c2c', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}
        title="Export current slide as PNG"
      >
        <ImageDown size={13} />
        PNG
      </button>

      {/* PDF */}
      <button
        onClick={handleExportPDF}
        style={{ ...btnBase, background: '#2c2c2c', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}
        title="Export all slides as PDF"
      >
        <FileDown size={13} />
        PDF
      </button>
    </div>
  )
}
