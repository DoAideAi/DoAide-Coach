import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// Node 22+ defines its own (file-backed, often unusable) localStorage global that
// shadows jsdom's, so install a plain in-memory Storage for tests.
class MemoryStorage {
  #data = new Map()
  get length() { return this.#data.size }
  key(i) { return [...this.#data.keys()][i] ?? null }
  getItem(k) { return this.#data.has(k) ? this.#data.get(k) : null }
  setItem(k, v) { this.#data.set(k, String(v)) }
  removeItem(k) { this.#data.delete(k) }
  clear() { this.#data.clear() }
}
Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true })

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
