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

// Mock react-hot-toast — default export must be callable (toast('msg')) AND have .success/.error methods
vi.mock('react-hot-toast', () => {
  const toast = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  })
  return { default: toast, toast }
})

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
