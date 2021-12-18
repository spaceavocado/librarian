import { Evaluable } from '../Evaluable'
import { not } from '../not'

describe('librarian / core', () => {
  describe('not', () => {
    const yes: Evaluable = { evaluate: () => [] }
    const no: Evaluable = { evaluate: () => false }

    it.each([
      [yes, false],
      [no, []],
    ])('operand %p should be evaluated as %s', (operand, expected) => {
      expect(not(operand).evaluate('')).toStrictEqual(expected)
    })
  })
})
