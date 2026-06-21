import { useRef } from 'react'
import { Copy, ImageDown, FileDown, Trash2, Play, Upload, Download } from 'lucide-react'
import { useBoardStore } from '../../store/useBoardStore'
import { exportPNG } from '../../utils/exportPNG'
import { exportAllSlidesPDF } from '../../utils/exportPDF'

interface Props {
  boardRef: React.RefObject<HTMLElement | null>
  onPlay: () => void
}

const btnBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
  cursor: 'pointer', border: 'none', transition: 'all 0.15s',
  whiteSpace: 'nowrap', letterSpacing: '0.02em',
}

export function Toolbar({ boardRef, onPlay }: Props) {
  const { activeSlideIndex, slides, duplicateSlide, deleteSlide, setActiveSlide, exportGameplan, importGameplan } = useBoardStore()
  const importInputRef = useRef<HTMLInputElement>(null)

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importGameplan(file)
    } catch (err) {
      alert(`Failed to import gameplan: ${(err as Error).message}`)
    }
    e.target.value = ''
  }

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

      {/* Play */}
      <button
        onClick={onPlay}
        style={{ ...btnBase, background: '#03b16b', color: '#fff', gap: 7 }}
        title="Play slide sequence"
      >
        <Play size={12} fill="#fff" />
        Play
      </button>

      {/* Duplicate */}
      <button
        onClick={() => duplicateSlide(activeSlideIndex)}
        style={{ ...btnBase, background: '#2c2c2c', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}
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

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />

      {/* Export Gameplan */}
      <button
        onClick={exportGameplan}
        style={{ ...btnBase, background: '#2c2c2c', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}
        title="Export gameplan as JSON"
      >
        <Download size={13} />
        Gameplan
      </button>

      {/* Import Gameplan */}
      <button
        onClick={() => importInputRef.current?.click()}
        style={{ ...btnBase, background: '#2c2c2c', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}
        title="Import gameplan from JSON"
      >
        <Upload size={13} />
        Import
      </button>
      <input
        ref={importInputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
    </div>
  )
}
