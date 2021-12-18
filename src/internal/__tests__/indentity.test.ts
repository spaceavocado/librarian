import { identity } from '../identity'

describe('internal / identity', () => {
  it.each([
    [1, 1],
    [true, true],
  ])('%p should be resolved as %p', (arg, expected) => {
    expect(identity(arg)).toBe(expected)
  })
})
