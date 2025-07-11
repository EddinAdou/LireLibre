import { describe, it, expect } from 'vitest'

describe('LireLibre Frontend', () => {
  it('should pass basic smoke test', () => {
    expect(true).toBe(true)
  })

  it('should have correct app name', () => {
    const appName = 'LireLibre'
    expect(appName).toBe('LireLibre')
  })
})
