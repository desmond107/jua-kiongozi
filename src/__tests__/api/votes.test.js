import { describe, it, expect, vi, beforeEach } from 'vitest'
import { castVote, getUserVote, getVoteSummary, getAllVotesAnalytics } from '../../api/votes'

vi.mock('../../api/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

import api from '../../api/axios'

beforeEach(() => vi.clearAllMocks())

describe('castVote()', () => {
  it('posts to /votes with correct payload', async () => {
    api.post.mockResolvedValue({ data: { id: 1, voteType: 'yes' } })
    const result = await castVote(1, 'yes')
    expect(api.post).toHaveBeenCalledWith('/votes', { data: { candidate: 1, voteType: 'yes' } })
    expect(result).toEqual({ id: 1, voteType: 'yes' })
  })

  it('passes "no" vote type correctly', async () => {
    api.post.mockResolvedValue({ data: {} })
    await castVote(2, 'no')
    expect(api.post).toHaveBeenCalledWith('/votes', { data: { candidate: 2, voteType: 'no' } })
  })

  it('throws when API fails', async () => {
    api.post.mockRejectedValue(new Error('Network error'))
    await expect(castVote(1, 'yes')).rejects.toThrow('Network error')
  })
})

describe('getUserVote()', () => {
  it('returns the first vote record if found', async () => {
    const mockVote = { id: 5, voteType: 'yes' }
    api.get.mockResolvedValue({ data: { data: [mockVote] } })
    const result = await getUserVote(1)
    expect(result).toEqual(mockVote)
  })

  it('returns null when no vote exists', async () => {
    api.get.mockResolvedValue({ data: { data: [] } })
    const result = await getUserVote(1)
    expect(result).toBeNull()
  })

  it('passes correct filter params', async () => {
    api.get.mockResolvedValue({ data: { data: [] } })
    await getUserVote(3)
    expect(api.get).toHaveBeenCalledWith('/votes', {
      params: {
        'filters[candidate][id][$eq]': 3,
        'filters[user][id][$eq]': 'me',
      },
    })
  })
})

describe('getVoteSummary()', () => {
  it('calls /votes/summary with candidateId param', async () => {
    api.get.mockResolvedValue({ data: { yes: 10, no: 3, unsure: 2 } })
    const result = await getVoteSummary(1)
    expect(api.get).toHaveBeenCalledWith('/votes/summary', { params: { candidateId: 1 } })
    expect(result).toEqual({ yes: 10, no: 3, unsure: 2 })
  })
})

describe('getAllVotesAnalytics()', () => {
  it('calls /votes/analytics', async () => {
    api.get.mockResolvedValue({ data: { candidates: [] } })
    const result = await getAllVotesAnalytics()
    expect(api.get).toHaveBeenCalledWith('/votes/analytics')
    expect(result).toEqual({ candidates: [] })
  })
})
