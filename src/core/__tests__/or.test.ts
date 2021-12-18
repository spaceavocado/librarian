import { Evaluable } from '../Evaluable'
import { or } from '../or'

describe('librarian / core', () => {
  describe('or', () => {
    const yes: Evaluable = { evaluate: () => [] }
    const no: Evaluable = { evaluate: () => false }

    it.each([
      [[yes], []],
      [[no], false],
      [[yes, no], []],
      [[no, no], false],
    ])('operands %p should be evaluated as %s', (operands, expected) => {
      expect(or(...operands).evaluate('')).toStrictEqual(expected)
    })
  })
})
