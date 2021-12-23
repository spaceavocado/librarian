import { NOT, not, TERM } from '..'
import { EvaluationResult, Serializable } from '../Evaluable'

describe('librarian / core', () => {
  describe('not', () => {
    const evaluable = (result: EvaluationResult) => ({
      id: Symbol(),
      kind: NOT + TERM,
      execute: () => result,
      test: () => false,
      toString: () => 'Evaluable',
    })

    describe('execute', () => {
      it.each([
        [evaluable(false), true],
        [evaluable(true), false],
      ])('operand %p should be executed as %s', (operand, expected) => {
        expect(not(operand).execute('')).toStrictEqual(expected)
      })

      it.each([[evaluable(true), jest.fn(), false]])(
        'operand %p with tap %p should be executed as %s',
        (operand, tap, expected) => {
          expect(not(operand).execute('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('test', () => {
      it.each([
        [evaluable(false), true],
        [evaluable(true), false],
      ])('operand %p should be tested as %s', (operand, expected) => {
        expect(not(operand).test('')).toStrictEqual(expected)
      })
    })

    describe('toString', () => {
      it.each([
        [undefined, 'NOT Evaluable'],
        [(operand: Serializable) => `!${operand.toString()}`, '!Evaluable'],
      ])('format %p should be produce %s', (format, expected) => {
        expect(not(evaluable(true)).toString(format)).toBe(expected)
      })
    })
  })
})
