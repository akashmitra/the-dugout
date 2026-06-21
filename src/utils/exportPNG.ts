import domtoimage from 'dom-to-image-more'

export async function exportPNG(element: HTMLElement, filename = 'tactics.png') {
  const rect = element.getBoundingClientRect()
  const dataUrl = await domtoimage.toPng(element, {
    width: rect.width * 2,
    height: rect.height * 2,
    style: {
      transform: 'scale(2)',
      transformOrigin: 'top left',
    },
  })
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}
