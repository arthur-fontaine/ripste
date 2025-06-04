import { testClient } from 'hono/testing'
import { describe, it, expect } from 'vitest'
import { app } from './app.ts'

describe('Ping Endpoint', () => {
  const client = testClient(app)

  it('should return ping response', async () => {
    const res = await client.ping.$get()

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      message: 'pong',
    })
  })
})
