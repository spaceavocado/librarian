import { replace } from '../replace'

describe('internal / replace', () => {
  it.each([
    ['dog', 'cat', 'dog', 'cat'],
    [/d.g/, 'cat', 'dog', 'cat'],
  ])('replace %p with %p as %p', (pattern, replacement, context, expected) => {
    expect(replace(pattern, replacement)(context)).toBe(expected)
  })
})
