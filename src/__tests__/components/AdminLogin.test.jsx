import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import AdminLogin from '../../components/admin/AdminLogin'

const renderLogin = (onSuccess = vi.fn()) =>
  render(<AdminLogin onSuccess={onSuccess} />)

describe('AdminLogin render', () => {
  it('shows the Admin Access heading', () => {
    renderLogin()
    expect(screen.getByText('Admin Access')).toBeInTheDocument()
  })

  it('renders a password input', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('Admin password')).toBeInTheDocument()
  })

  it('submit button is disabled when password is empty', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /access dashboard/i })).toBeDisabled()
  })
})

describe('AdminLogin — correct password', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('calls onSuccess and sets sessionStorage after the 800ms delay', () => {
    const onSuccess = vi.fn()
    renderLogin(onSuccess)

    fireEvent.change(screen.getByPlaceholderText('Admin password'), { target: { value: '226295' } })
    fireEvent.click(screen.getByRole('button', { name: /access dashboard/i }))

    expect(onSuccess).not.toHaveBeenCalled()
    act(() => vi.runAllTimers())
    expect(onSuccess).toHaveBeenCalledOnce()
    expect(sessionStorage.getItem('jk_admin')).toBe('true')
  })
})

describe('AdminLogin — wrong password', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('does not call onSuccess with wrong password', () => {
    const onSuccess = vi.fn()
    renderLogin(onSuccess)

    fireEvent.change(screen.getByPlaceholderText('Admin password'), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByRole('button', { name: /access dashboard/i }))
    act(() => vi.runAllTimers())

    expect(onSuccess).not.toHaveBeenCalled()
    expect(sessionStorage.getItem('jk_admin')).toBeNull()
  })

  it('disables input after 5 failed attempts', async () => {
    // Make setTimeout fire immediately so state updates are synchronous
    vi.spyOn(window, 'setTimeout').mockImplementation((fn) => { fn(); return 0 })

    renderLogin()
    const input = screen.getByPlaceholderText('Admin password')
    const form = input.closest('form')

    for (let i = 0; i < 5; i++) {
      await act(async () => {
        fireEvent.change(input, { target: { value: 'wrongpass' } })
        fireEvent.submit(form)
      })
    }

    vi.restoreAllMocks()
    expect(input).toBeDisabled()
    expect(screen.getByRole('button', { name: /access dashboard/i })).toBeDisabled()
  })
})

describe('AdminLogin — password visibility toggle', () => {
  it('toggles password field between text and password type', async () => {
    renderLogin()
    const input = screen.getByPlaceholderText('Admin password')
    expect(input).toHaveAttribute('type', 'password')

    const toggleBtn = input.closest('form').querySelector('button[type="button"]')

    await act(async () => { fireEvent.click(toggleBtn) })
    expect(input).toHaveAttribute('type', 'text')

    await act(async () => { fireEvent.click(toggleBtn) })
    expect(input).toHaveAttribute('type', 'password')
  })
})
