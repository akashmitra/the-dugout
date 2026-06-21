import domtoimage from 'dom-to-image-more'
import jsPDF from 'jspdf'

async function elementToPngDataUrl(element: HTMLElement): Promise<string> {
  const rect = element.getBoundingClientRect()
  return domtoimage.toPng(element, {
    width: rect.width * 2,
    height: rect.height * 2,
    style: {
      transform: 'scale(2)',
      transformOrigin: 'top left',
    },
  })
}

export async function exportPDF(element: HTMLElement, filename = 'tactics.pdf') {
  const W = 297
  const H = 167
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [W, H] })

  const imgData = await elementToPngDataUrl(element)
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
    await new Promise(r => setTimeout(r, 120))
    const el = getElement()
    if (!el) continue
    const imgData = await elementToPngDataUrl(el)
    if (i > 0) pdf.addPage([W, H], 'landscape')
    pdf.addImage(imgData, 'PNG', 0, 0, W, H)
  }
  pdf.save(filename)
}
