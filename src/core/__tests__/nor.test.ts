import { NOR, nor } from '..'
import { EvaluationResult, Serializable } from '../Evaluable'

describe('librarian / core', () => {
  describe('nor', () => {
    const evaluable = (result: EvaluationResult) => ({
      id: Symbol(),
      kind: NOR,
      execute: () => result,
      test: () => false,
      toString: () => 'Evaluable',
    })

    test('constructor', () => {
      expect(() => nor()).toThrow()
      expect(() => nor(evaluable(true))).toThrow()
    })

    describe('execute', () => {
      it.each([
        [[evaluable(false), evaluable(false)], true],
        [[evaluable(true), evaluable(false)], false],
        [[evaluable(false), evaluable(true)], false],
        [[evaluable(true), evaluable(true)], false],
      ])('operands %p should be executed as %s', (operands, expected) => {
        expect(nor(...operands).execute('')).toStrictEqual(expected)
      })

      it.each([[[evaluable(false), evaluable(false)], jest.fn(), true]])(
        'operands %p with tap %p should be executed as %s',
        (operands, tap, expected) => {
          expect(nor(...operands).execute('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('test', () => {
      it.each([
        [[evaluable(false), evaluable(false)], true],
        [[evaluable(true), evaluable(false)], false],
        [[evaluable(false), evaluable(true)], false],
        [[evaluable(true), evaluable(true)], false],
      ])('operands %p should be tested as %s', (operands, expected) => {
        expect(nor(...operands).test('')).toStrictEqual(expected)
      })
    })

    describe('toString', () => {
      it.each([
        [undefined, '(Evaluable NOR Evaluable)'],
        [
          (...operands: Serializable[]) =>
            operands.map((operand) => operand.toString()).join(' ↓ '),
          'Evaluable ↓ Evaluable',
        ],
      ])('format %p should be produce %s', (format, expected) => {
        expect(nor(evaluable(true), evaluable(true)).toString(format)).toBe(
          expected
        )
      })
    })
  })
})
