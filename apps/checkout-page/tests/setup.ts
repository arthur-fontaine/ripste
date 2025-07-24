import { afterAll, beforeAll, vi } from 'vitest'
import { setTimeout } from 'node:timers/promises'
import { dev } from 'vike/api'
import path from 'node:path'
import { MikroOrmDatabase } from '@ripste/db/mikro-orm';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { unlink } from 'node:fs/promises';

vi.mock("../src/database.ts", async () => ({
  database: await MikroOrmDatabase.create(SqliteDriver, "test.db"),
}));

let viteServer: Awaited<ReturnType<typeof dev>>['viteServer'] | undefined = undefined

beforeAll(async () => {
  const root = path.resolve(__dirname, '..')
  const { viteServer: _viteServer } = await dev({
    viteConfig: {
      logLevel: 'warn' as const,
      root,
      configFile: `${root}/vite.config.ts`,
      resolve: {
        alias: {
          '../../database.ts': path.resolve(root, 'tests/test-utils/fakeDatabase.ts'),
          '../../apiClient.ts': path.resolve(root, 'tests/test-utils/fakeApiClient.ts'),
        },
      },
    }
  })
  viteServer = _viteServer
  await viteServer.listen()
  await setTimeout(10) // avoid race condition of server not actually being ready
}, 10 * 1000)

afterAll(async () => {
  await viteServer?.close()
  await unlink('test.db').catch(() => {});
})
