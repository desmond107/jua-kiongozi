import '@testing-library/jest-dom'

// Replace framer-motion with stable passthrough components.
// Components are cached so the same function reference is returned each render,
// preventing React from unmounting/remounting subtrees.
vi.mock('framer-motion', () => {
  const cache = {}
  return {
    motion: new Proxy({}, {
      get: (_, tag) => {
        if (!cache[tag]) cache[tag] = ({ children }) => children
        return cache[tag]
      },
    }),
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({ start: () => {} }),
    useInView: () => true,
    useMotionValue: (v) => ({ get: () => v, set: () => {} }),
    useSpring: (v) => ({ get: () => v }),
    useTransform: () => ({ get: () => 0 }),
  }
})

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn(), loading: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn(), loading: vi.fn() },
}))

// localStorage mock
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// sessionStorage mock
const sessionStorageMock = (() => {
  let store = {}
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock })

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.clearAllMocks()
})
