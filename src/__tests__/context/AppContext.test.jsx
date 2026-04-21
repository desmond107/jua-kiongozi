import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AppProvider, useApp } from '../../context/AppContext'
import { PRESIDENTIAL_CANDIDATES } from '../../utils/candidatesData'

// Helper that renders a child exposing context values
const ContextSpy = ({ onRender }) => {
  const ctx = useApp()
  onRender(ctx)
  return null
}

const renderWithProvider = (onRender) =>
  render(<AppProvider><ContextSpy onRender={onRender} /></AppProvider>)

describe('AppProvider initial state', () => {
  it('exposes all 9 candidates', () => {
    let ctx
    renderWithProvider((c) => { ctx = c })
    expect(ctx.candidates).toHaveLength(PRESIDENTIAL_CANDIDATES.length)
  })

  it('votes starts empty', () => {
    let ctx
    renderWithProvider((c) => { ctx = c })
    expect(ctx.votes).toEqual({})
  })

  it('getUserVote returns null for unknown candidate', () => {
    let ctx
    renderWithProvider((c) => { ctx = c })
    expect(ctx.getUserVote(99)).toBeNull()
  })
})

describe('castLocalVote()', () => {
  it('stores vote in state and localStorage', () => {
    let ctx
    renderWithProvider((c) => { ctx = c })

    act(() => ctx.castLocalVote(1, 'yes'))

    expect(ctx.getUserVote(1)).toBe('yes')
    const saved = JSON.parse(localStorage.getItem('jk_local_votes'))
    expect(saved[1]).toBe('yes')
  })

  it('overwrites a previous vote', () => {
    let ctx
    renderWithProvider((c) => { ctx = c })

    act(() => ctx.castLocalVote(1, 'yes'))
    act(() => ctx.castLocalVote(1, 'no'))

    expect(ctx.getUserVote(1)).toBe('no')
  })

  it('can record different vote types', () => {
    let ctx
    renderWithProvider((c) => { ctx = c })

    act(() => ctx.castLocalVote(1, 'yes'))
    act(() => ctx.castLocalVote(2, 'no'))
    act(() => ctx.castLocalVote(3, 'unsure'))

    expect(ctx.getUserVote(1)).toBe('yes')
    expect(ctx.getUserVote(2)).toBe('no')
    expect(ctx.getUserVote(3)).toBe('unsure')
  })
})

describe('useApp() outside provider', () => {
  it('throws a descriptive error', () => {
    const Broken = () => { useApp(); return null }
    expect(() => render(<Broken />)).toThrow('useApp must be used within AppProvider')
  })
})
