import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CandidateCard from '../../components/CandidateCard'

// Module-level spies so we can inspect them in tests
const castLocalVote = vi.fn()
const getUserVote = vi.fn(() => null)
const setShowAuthModal = vi.fn()
let isAuthenticated = true

vi.mock('../../context/AppContext', () => ({
  useApp: () => ({ getUserVote, castLocalVote }),
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated, setShowAuthModal }),
}))

vi.mock('../../api/votes', () => ({
  castVote: vi.fn().mockResolvedValue({}),
}))

beforeEach(() => {
  castLocalVote.mockClear()
  getUserVote.mockClear()
  getUserVote.mockReturnValue(null)
  setShowAuthModal.mockClear()
  isAuthenticated = true
})

const mockCandidate = {
  id: 1,
  slug: 'william-ruto',
  name: 'William Samoei Ruto',
  nickname: 'Hustler President',
  party: 'United Democratic Alliance (UDA)',
  partyShortname: 'UDA',
  partyColor: '#FF6B00',
  constituency: 'Sugoi, Uasin Gishu County',
  status: 'announced',
  image: 'https://example.com/ruto.jpg',
  tags: ['incumbent', 'president'],
}

const renderCard = (candidate = mockCandidate) =>
  render(
    <MemoryRouter>
      <CandidateCard candidate={candidate} index={0} />
    </MemoryRouter>,
  )

describe('CandidateCard render', () => {
  it('displays the candidate name', () => {
    renderCard()
    expect(screen.getByText('William Samoei Ruto')).toBeInTheDocument()
  })

  it('displays the nickname', () => {
    renderCard()
    expect(screen.getByText('"Hustler President"')).toBeInTheDocument()
  })

  it('displays the party name', () => {
    renderCard()
    expect(screen.getByText('United Democratic Alliance (UDA)')).toBeInTheDocument()
  })

  it('displays the constituency', () => {
    renderCard()
    expect(screen.getByText('Sugoi, Uasin Gishu County')).toBeInTheDocument()
  })

  it('renders Yes / No / Unsure vote buttons', () => {
    renderCard()
    expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /no/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /unsure/i })).toBeInTheDocument()
  })

  it('renders candidate tags', () => {
    renderCard()
    expect(screen.getByText('#incumbent')).toBeInTheDocument()
    expect(screen.getByText('#president')).toBeInTheDocument()
  })

  it('renders a link to the candidate profile', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /view profile/i })
    expect(link).toHaveAttribute('href', '/candidates/william-ruto')
  })

  it('shows "Confirmed" badge for announced candidates', () => {
    renderCard()
    expect(screen.getByText('Confirmed')).toBeInTheDocument()
  })

  it('shows "Exploring" badge for non-announced candidates', () => {
    renderCard({ ...mockCandidate, status: 'exploring' })
    expect(screen.getByText('Exploring')).toBeInTheDocument()
  })
})

describe('CandidateCard voting', () => {
  it('calls castLocalVote with "yes" when Yes button is clicked', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: /yes/i }))
    expect(castLocalVote).toHaveBeenCalledWith(1, 'yes')
  })

  it('calls castLocalVote with "no" when No button is clicked', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: /no/i }))
    expect(castLocalVote).toHaveBeenCalledWith(1, 'no')
  })

  it('calls castLocalVote with "unsure" when Unsure button is clicked', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: /unsure/i }))
    expect(castLocalVote).toHaveBeenCalledWith(1, 'unsure')
  })

  it('does not call castLocalVote when unauthenticated', () => {
    isAuthenticated = false
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: /yes/i }))
    expect(castLocalVote).not.toHaveBeenCalled()
  })
})
