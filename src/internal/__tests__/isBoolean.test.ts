import { isBoolean } from '../isBoolean'

describe('internal / isBoolean', () => {
  it.each([
    [true, true],
    [false, true],
    [Boolean(true), true],
    ['value', false],
    [1, false],
    [null, false],
    [undefined, false],
    [{}, false],
    [() => true, false],
    [[], false],
    [Symbol(), false],
  ])('%p should evaluate as %p', (arg, expected) => {
    expect(isBoolean(arg)).toBe(expected)
  })
})
