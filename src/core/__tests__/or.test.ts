import { OR, or } from '..'
import { EvaluationResult, Serializable } from '../Evaluable'

describe('librarian / core', () => {
  describe('or', () => {
    const evaluable = (result: EvaluationResult) => ({
      id: Symbol(),
      kind: OR,
      execute: () => result,
      test: () => false,
      toString: () => 'Evaluable',
    })

    const match = { index: 0, length: 0, match: 'match', term: 'match' }

    test('constructor', () => {
      expect(() => or()).toThrow()
      expect(() => or(evaluable(true))).toThrow()
    })

    describe('execute', () => {
      it.each([
        [[evaluable(false), evaluable(false)], false],
        [[evaluable(true), evaluable(false)], true],
        [[evaluable([match]), evaluable(false)], [match]],
        [[evaluable(false), evaluable(true)], true],
        [[evaluable(true), evaluable(true)], true],
        [[evaluable([match]), evaluable([match])], [match]],
      ])('operands %p should be executed as %s', (operands, expected) => {
        expect(or(...operands).execute('')).toStrictEqual(expected)
      })

      it.each([[[evaluable(true), evaluable(true)], jest.fn(), true]])(
        'operands %p with tap %p should be executed as %s',
        (operands, tap, expected) => {
          expect(or(...operands).execute('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('test', () => {
      it.each([
        [[evaluable(false), evaluable(false)], false],
        [[evaluable(false), evaluable(true)], true],
        [[evaluable(true), evaluable(false)], true],
        [[evaluable(true), evaluable(true)], true],
      ])('operands %p should be tested as %s', (operands, expected) => {
        expect(or(...operands).test('')).toStrictEqual(expected)
      })
    })

    describe('toString', () => {
      it.each([
        [undefined, '(Evaluable OR Evaluable)'],
        [
          (...operands: Serializable[]) =>
            operands.map((operand) => operand.toString()).join(' || '),
          'Evaluable || Evaluable',
        ],
      ])('format %p should be produce %s', (format, expected) => {
        expect(or(evaluable(true), evaluable(true)).toString(format)).toBe(
          expected
        )
      })
    })
  })
})
