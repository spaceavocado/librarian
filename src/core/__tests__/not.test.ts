import { NOT, not } from '..'
import { Evaluable, Serializable } from '../Evaluable'

describe('librarian / core', () => {
  describe('not', () => {
    const yes: Evaluable = {
      id: Symbol(),
      kind: NOT,
      execute: () => [],
      test: () => false,
      toString: () => 'Yes',
    }
    const no: Evaluable = {
      id: Symbol(),
      kind: NOT,
      execute: () => false,
      test: () => false,
    }

    describe('execute', () => {
      it.each([
        [yes, false],
        [no, []],
      ])('operand %p should be executed as %s', (operand, expected) => {
        expect(not(operand).execute('')).toStrictEqual(expected)
      })

      it.each([[yes, jest.fn(), false]])(
        'operand %p with tap %p should be executed as %s',
        (operand, tap, expected) => {
          expect(not(operand).execute('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('test', () => {
      it.each([
        [yes, false],
        [no, true],
      ])('operand %p should be tested as %s', (operand, expected) => {
        expect(not(operand).test('')).toStrictEqual(expected)
      })
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
