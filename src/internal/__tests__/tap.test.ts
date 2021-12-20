import { tap } from '../tap'

describe('internal / tap', () => {
  it.each([[1, jest.fn(), 1]])(
    'argument %p passed trough %p tap function is resolved as %p',
    (arg, fn, expected) => {
      expect(tap(fn)(arg)).toBe(expected)
    }
  )
})
