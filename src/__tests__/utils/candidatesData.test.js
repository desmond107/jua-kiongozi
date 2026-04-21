import { describe, it, expect } from 'vitest'
import { PRESIDENTIAL_CANDIDATES, getCandidate } from '../../utils/candidatesData'

describe('PRESIDENTIAL_CANDIDATES', () => {
  it('contains exactly 9 candidates', () => {
    expect(PRESIDENTIAL_CANDIDATES).toHaveLength(9)
  })

  it('every candidate has required fields', () => {
    const required = ['id', 'slug', 'name', 'party', 'partyShortname', 'partyColor',
      'constituency', 'county', 'region', 'status', 'image', 'manifesto', 'biography']
    PRESIDENTIAL_CANDIDATES.forEach((c) => {
      required.forEach((field) => {
        expect(c, `${c.name} missing "${field}"`).toHaveProperty(field)
        expect(c[field], `${c.name}.${field} is empty`).toBeTruthy()
      })
    })
  })

  it('all ids are unique', () => {
    const ids = PRESIDENTIAL_CANDIDATES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all slugs are unique and URL-safe', () => {
    const slugs = PRESIDENTIAL_CANDIDATES.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/))
  })

  it('status is either "announced" or "exploring"', () => {
    PRESIDENTIAL_CANDIDATES.forEach((c) => {
      expect(['announced', 'exploring']).toContain(c.status)
    })
  })

  it('includes William Ruto as the incumbent', () => {
    const ruto = PRESIDENTIAL_CANDIDATES.find((c) => c.slug === 'william-ruto')
    expect(ruto).toBeDefined()
    expect(ruto.currentPosition).toMatch(/president/i)
  })

  it('education, achievements, previousPositions are non-empty arrays', () => {
    PRESIDENTIAL_CANDIDATES.forEach((c) => {
      expect(Array.isArray(c.education)).toBe(true)
      expect(c.education.length).toBeGreaterThan(0)
      expect(Array.isArray(c.achievements)).toBe(true)
      expect(c.achievements.length).toBeGreaterThan(0)
      expect(Array.isArray(c.previousPositions)).toBe(true)
      expect(c.previousPositions.length).toBeGreaterThan(0)
    })
  })
})

describe('getCandidate()', () => {
  it('returns a candidate by slug', () => {
    const c = getCandidate('william-ruto')
    expect(c).toBeDefined()
    expect(c.name).toBe('William Samoei Ruto')
  })

  it('returns undefined for unknown slug', () => {
    expect(getCandidate('john-doe')).toBeUndefined()
  })

  it('returns undefined for a slug with wrong case', () => {
    expect(getCandidate('WILLIAM-RUTO')).toBeUndefined()
  })
})
