import { toLower } from '../toLower'

describe('internal / toLower', () => {
  it.each([
    ['Lorem', 'lorem'],
    ['lorem', 'lorem'],
    ['LOREM', 'lorem'],
  ])('%p should be resolved as %p', (arg, expected) => {
    expect(toLower(arg)).toBe(expected)
  })
})
