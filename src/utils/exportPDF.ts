import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportPDF(element: HTMLElement, filename = 'tactics.pdf') {
  // 16:9 in mm — standard widescreen presentation
  const W = 297
  const H = 167
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [W, H] })

  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: 2,
    backgroundColor: '#1a1a2e',
  })
  const imgData = canvas.toDataURL('image/png')
  pdf.addImage(imgData, 'PNG', 0, 0, W, H)

  pdf.save(filename)
}

export async function exportAllSlidesPDF(
  getElement: () => HTMLElement | null,
  switchSlide: (i: number) => void,
  totalSlides: number,
  filename = 'tactics.pdf'
) {
  const W = 297
  const H = 167
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [W, H] })

  for (let i = 0; i < totalSlides; i++) {
    switchSlide(i)
    // Small wait for React to re-render
    await new Promise(r => setTimeout(r, 120))
    const el = getElement()
    if (!el) continue
    const canvas = await html2canvas(el, {
      useCORS: true,
      scale: 2,
      backgroundColor: '#1a1a2e',
    })
    const imgData = canvas.toDataURL('image/png')
    if (i > 0) pdf.addPage([W, H], 'landscape')
    pdf.addImage(imgData, 'PNG', 0, 0, W, H)
  }
  pdf.save(filename)
}
