import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  loginWithEmail, registerUser,
  requestWhatsAppOTP, verifyWhatsAppOTP, getMe,
} from '../../api/auth'

vi.mock('../../api/axios', () => ({
  default: { post: vi.fn(), get: vi.fn(), put: vi.fn() },
}))

import api from '../../api/axios'

beforeEach(() => vi.clearAllMocks())

describe('loginWithEmail()', () => {
  it('posts to /auth/local with identifier and password', async () => {
    api.post.mockResolvedValue({ data: { jwt: 'tok', user: { id: 1 } } })
    const result = await loginWithEmail('test@test.com', 'pass123')
    expect(api.post).toHaveBeenCalledWith('/auth/local', { identifier: 'test@test.com', password: 'pass123' })
    expect(result.jwt).toBe('tok')
  })

  it('throws on wrong credentials', async () => {
    api.post.mockRejectedValue({ response: { status: 400 } })
    await expect(loginWithEmail('bad@email.com', 'wrong')).rejects.toBeTruthy()
  })
})

describe('registerUser()', () => {
  it('posts to /auth/local/register', async () => {
    api.post.mockResolvedValue({ data: { jwt: 'tok', user: { id: 2 } } })
    const result = await registerUser({ username: 'Alice', email: 'a@b.com', password: 'pass1234' })
    expect(api.post).toHaveBeenCalledWith('/auth/local/register', {
      username: 'Alice', email: 'a@b.com', password: 'pass1234',
    })
    expect(result.user.id).toBe(2)
  })
})

describe('requestWhatsAppOTP()', () => {
  it('posts phone to /auth/whatsapp-otp/send', async () => {
    api.post.mockResolvedValue({ data: { ok: true } })
    await requestWhatsAppOTP('+254712345678')
    expect(api.post).toHaveBeenCalledWith('/auth/whatsapp-otp/send', { phone: '+254712345678' })
  })
})

describe('verifyWhatsAppOTP()', () => {
  it('posts phone + otp to /auth/whatsapp-otp/verify', async () => {
    api.post.mockResolvedValue({ data: { jwt: 'tok', user: { id: 3 } } })
    const result = await verifyWhatsAppOTP('+254712345678', '123456')
    expect(api.post).toHaveBeenCalledWith('/auth/whatsapp-otp/verify', {
      phone: '+254712345678', otp: '123456',
    })
    expect(result.jwt).toBe('tok')
  })
})

describe('getMe()', () => {
  it('calls /users/me with populate=*', async () => {
    api.get.mockResolvedValue({ data: { id: 1, username: 'Alice' } })
    const result = await getMe()
    expect(api.get).toHaveBeenCalledWith('/users/me?populate=*')
    expect(result.username).toBe('Alice')
  })
})
