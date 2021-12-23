import { AND, and, EvaluationResult } from '..'
import { Serializable } from '../Evaluable'

describe('librarian / core', () => {
  describe('and', () => {
    const evaluable = (result: EvaluationResult) => ({
      id: Symbol(),
      kind: AND,
      execute: () => result,
      test: () => false,
      toString: () => 'Evaluable',
    })

    const match = { index: 0, length: 0, match: 'match', term: 'match' }

    test('constructor', () => {
      expect(() => and()).toThrow()
      expect(() => and(evaluable(true))).toThrow()
    })

    describe('execute', () => {
      it.each([
        [[evaluable(true), evaluable(true)], true],
        [[evaluable(true), evaluable([match])], [match]],
        [
          [evaluable([match]), evaluable([match])],
          [match, match],
        ],
        [[evaluable(false), evaluable(false)], false],
        [[evaluable(false), evaluable(true)], false],
        [[evaluable(true), evaluable(false)], false],
      ])('operands %p should be executed as %s', (operands, expected) => {
        expect(and(...operands).execute('')).toStrictEqual(expected)
      })

      it.each([[[evaluable(true), evaluable(true)], jest.fn(), true]])(
        'operands %p with tap %p should be executed as %s',
        (operands, tap, expected) => {
          expect(and(...operands).execute('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('test', () => {
      it.each([
        [[evaluable(true), evaluable(true)], true],
        [[evaluable(false), evaluable(false)], false],
        [[evaluable(false), evaluable(true)], false],
        [[evaluable(true), evaluable(false)], false],
      ])('operands %p should be tested as %s', (operands, expected) => {
        expect(and(...operands).test('')).toStrictEqual(expected)
      })
    })

    describe('toString', () => {
      it.each([
        [undefined, '(Evaluable AND Evaluable)'],
        [
          (...operands: Serializable[]) =>
            operands.map((operand) => operand.toString()).join(' && '),
          'Evaluable && Evaluable',
        ],
      ])('format %p should be produce %s', (format, expected) => {
        expect(and(evaluable(true), evaluable(true)).toString(format)).toBe(
          expected
        )
      })
    })
  })
})
