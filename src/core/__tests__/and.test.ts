import { and } from '../and'
import { Evaluable } from '../Evaluable'

describe('librarian / core', () => {
  describe('and', () => {
    const yes: Evaluable = { evaluate: () => [] }
    const no: Evaluable = { evaluate: () => false }

    it.each([
      [[yes], []],
      [[no], false],
      [[yes, no], false],
      [[yes, yes], []],
    ])('operands %p should be evaluated as %s', (operands, expected) => {
      expect(and(...operands).evaluate('')).toStrictEqual(expected)
    })
  })
})
