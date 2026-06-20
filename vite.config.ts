import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import type { Plugin } from 'vite'

function saveTeamPlugin(): Plugin {
  return {
    name: 'save-team',
    configureServer(server) {
      server.middlewares.use('/api/save-team', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', () => {
          try {
            const { code, content } = JSON.parse(body)
            if (!code || !content) throw new Error('Missing code or content')
            // Sanitise: only allow alphanumeric codes up to 6 chars
            const safeCode = String(code).replace(/[^A-Z0-9]/gi, '').slice(0, 6).toUpperCase()
            const dest = resolve(__dirname, 'src/data', `${safeCode}.json`)
            writeFileSync(dest, content, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, path: dest }))
          } catch (e) {
            res.statusCode = 400
            res.end(JSON.stringify({ ok: false, error: String(e) }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), saveTeamPlugin()],
})
