import { describe, it, expect } from 'vitest'
import { KENYA_COUNTIES, KENYA_REGIONS, getCountiesByRegion, getCounty } from '../../utils/counties'

describe('KENYA_COUNTIES', () => {
  it('contains exactly 47 counties', () => {
    expect(KENYA_COUNTIES).toHaveLength(47)
  })

  it('every county has id, name, region and capital', () => {
    KENYA_COUNTIES.forEach((c) => {
      expect(c).toHaveProperty('id')
      expect(c).toHaveProperty('name')
      expect(c).toHaveProperty('region')
      expect(c).toHaveProperty('capital')
    })
  })

  it('ids are sequential from 1 to 47', () => {
    const ids = KENYA_COUNTIES.map((c) => c.id).sort((a, b) => a - b)
    ids.forEach((id, i) => expect(id).toBe(i + 1))
  })

  it('includes Nairobi county', () => {
    const nairobi = KENYA_COUNTIES.find((c) => c.name === 'Nairobi')
    expect(nairobi).toBeDefined()
    expect(nairobi.capital).toBe('Nairobi City')
  })

  it('includes Mombasa county in Coast region', () => {
    const mombasa = KENYA_COUNTIES.find((c) => c.name === 'Mombasa')
    expect(mombasa).toBeDefined()
    expect(mombasa.region).toBe('Coast')
  })
})

describe('KENYA_REGIONS', () => {
  it('contains 8 regions', () => {
    expect(KENYA_REGIONS).toHaveLength(8)
  })

  it('includes all expected regions', () => {
    const expected = ['Nairobi', 'Central', 'Coast', 'Eastern', 'North Eastern', 'Nyanza', 'Rift Valley', 'Western']
    expected.forEach((r) => expect(KENYA_REGIONS).toContain(r))
  })
})

describe('getCountiesByRegion()', () => {
  it('returns only counties in the given region', () => {
    const coast = getCountiesByRegion('Coast')
    expect(coast.length).toBeGreaterThan(0)
    coast.forEach((c) => expect(c.region).toBe('Coast'))
  })

  it('returns 6 Coast counties', () => {
    expect(getCountiesByRegion('Coast')).toHaveLength(6)
  })

  it('returns empty array for unknown region', () => {
    expect(getCountiesByRegion('Unknown Region')).toHaveLength(0)
  })

  it('total counties across all regions equals 47', () => {
    const total = KENYA_REGIONS.reduce(
      (sum, r) => sum + getCountiesByRegion(r).length,
      0,
    )
    expect(total).toBe(47)
  })
})

describe('getCounty()', () => {
  it('finds a county by exact name', () => {
    const c = getCounty('Nairobi')
    expect(c).toBeDefined()
    expect(c.id).toBe(47)
  })

  it('is case-insensitive', () => {
    expect(getCounty('nairobi')).toBeDefined()
    expect(getCounty('NAIROBI')).toBeDefined()
  })

  it('returns undefined for unknown county', () => {
    expect(getCounty('Atlantis')).toBeUndefined()
  })
})
