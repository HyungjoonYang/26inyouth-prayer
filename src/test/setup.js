import '@testing-library/jest-dom'

if (!crypto.randomUUID) {
  crypto.randomUUID = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
}

globalThis.confirm = vi.fn(() => true)
globalThis.alert = vi.fn()

Element.prototype.scrollIntoView = vi.fn()

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})
