import { Copy, ImageDown, FileDown, Trash2 } from 'lucide-react'
import { useBoardStore } from '../../store/useBoardStore'
import { exportPNG } from '../../utils/exportPNG'
import { exportAllSlidesPDF } from '../../utils/exportPDF'

interface Props {
  boardRef: React.RefObject<HTMLElement | null>
}

export function Toolbar({ boardRef }: Props) {
  const { activeSlideIndex, slides, duplicateSlide, deleteSlide, setActiveSlide } = useBoardStore()

  function handleDuplicate() {
    duplicateSlide(activeSlideIndex)
  }

  function handleDeleteSlide() {
    if (slides.length === 1) return
    deleteSlide(activeSlideIndex)
  }

  async function handleExportPNG() {
    if (!boardRef.current) return
    await exportPNG(boardRef.current, `tactics-slide-${activeSlideIndex + 1}.png`)
  }

  async function handleExportPDF() {
    await exportAllSlidesPDF(
      () => boardRef.current,
      setActiveSlide,
      slides.length,
      'tactics.pdf'
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDuplicate}
        title="Duplicate slide"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
      >
        <Copy size={13} />
        Duplicate
      </button>

      <button
        onClick={handleDeleteSlide}
        disabled={slides.length === 1}
        title="Delete slide"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-gray-700 hover:bg-red-700 disabled:opacity-30 text-white text-xs transition-colors"
      >
        <Trash2 size={13} />
      </button>

      <div className="w-px h-5 bg-gray-600 mx-1" />

      <button
        onClick={handleExportPNG}
        title="Export current slide as PNG"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white text-xs transition-colors"
      >
        <ImageDown size={13} />
        PNG
      </button>

      <button
        onClick={handleExportPDF}
        title="Export all slides as PDF"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white text-xs transition-colors"
      >
        <FileDown size={13} />
        PDF
      </button>

      <div className="ml-2 text-xs text-gray-500">
        Slide {activeSlideIndex + 1} / {slides.length}
      </div>
    </div>
  )
}
