import { Evaluable, Serializable } from '../Evaluable'
import { NOT, not } from '../not'

describe('librarian / core', () => {
  describe('not', () => {
    const yes: Evaluable = {
      id: Symbol(),
      kind: NOT,
      evaluate: () => [],
      toString: () => 'Yes',
    }
    const no: Evaluable = { id: Symbol(), kind: NOT, evaluate: () => false }

    describe('evaluate', () => {
      it.each([
        [yes, false],
        [no, []],
      ])('operand %p should be evaluated as %s', (operand, expected) => {
        expect(not(operand).evaluate('')).toStrictEqual(expected)
      })

      it.each([[yes, jest.fn(), false]])(
        'operand %p with tap %p should be evaluated as %s',
        (operand, tap, expected) => {
          expect(not(operand).evaluate('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('toString', () => {
      it.each([
        [undefined, 'NOT Yes'],
        [(operand: Serializable) => `!${operand.toString()}`, '!Yes'],
      ])('format %p should be produce %s', (format, expected) => {
        expect(not(yes).toString(format)).toBe(expected)
      })
    })
  })
})
