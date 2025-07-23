import { afterAll, beforeAll } from 'vitest'
import { setTimeout } from 'node:timers/promises'
import { dev } from 'vike/api'
import path from 'node:path'

let viteServer: Awaited<ReturnType<typeof dev>>['viteServer'] | undefined = undefined

beforeAll(async () => {
  const root = path.resolve(__dirname, '..')
  const { viteServer: _viteServer } = await dev({
    viteConfig: {
      logLevel: 'warn' as const,
      root,
      configFile: `${root}/vite.config.ts`
    }
  })
  viteServer = _viteServer
  await viteServer.listen()
  await setTimeout(10) // avoid race condition of server not actually being ready
}, 10 * 1000)

afterAll(async () => {
  await viteServer?.close()
})
