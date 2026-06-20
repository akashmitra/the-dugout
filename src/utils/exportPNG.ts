import html2canvas from 'html2canvas'

export async function exportPNG(element: HTMLElement, filename = 'tactics.png') {
  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: 2,
    backgroundColor: '#1a1a2e',
    width: element.offsetWidth,
    height: element.offsetHeight,
  })
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}
