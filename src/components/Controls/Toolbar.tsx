import { Copy, ImageDown, FileDown, Trash2 } from 'lucide-react'
import { useBoardStore } from '../../store/useBoardStore'
import { exportPNG } from '../../utils/exportPNG'
import { exportAllSlidesPDF } from '../../utils/exportPDF'

interface Props {
  boardRef: React.RefObject<HTMLElement | null>
}

const btnBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
  cursor: 'pointer', border: 'none', transition: 'all 0.15s',
  whiteSpace: 'nowrap',
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
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginRight: 4 }}>
        Slide {activeSlideIndex + 1} / {slides.length}
      </span>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />

      {/* Duplicate */}
      <button
        onClick={() => duplicateSlide(activeSlideIndex)}
        style={{ ...btnBase, background: '#4f46e5', color: '#fff' }}
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
        style={{ ...btnBase, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', padding: '5px 8px' }}
      >
        <Trash2 size={13} />
      </button>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />

      {/* PNG */}
      <button
        onClick={handleExportPNG}
        style={{ ...btnBase, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}
        title="Export current slide as PNG"
      >
        <ImageDown size={13} />
        PNG
      </button>

      {/* PDF */}
      <button
        onClick={handleExportPDF}
        style={{ ...btnBase, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}
        title="Export all slides as PDF"
      >
        <FileDown size={13} />
        PDF
      </button>
    </div>
  )
}
