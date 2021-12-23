import { XOR, xor } from '..'
import { EvaluationResult, Serializable } from '../Evaluable'

describe('librarian / core', () => {
  describe('xor', () => {
    const evaluable = (result: EvaluationResult) => ({
      id: Symbol(),
      kind: XOR,
      execute: () => result,
      test: () => false,
      toString: () => 'Evaluable',
    })

    const match = { index: 0, length: 0, match: 'match', term: 'match' }

    test('constructor', () => {
      expect(() => xor()).toThrow()
      expect(() => xor(evaluable(true))).toThrow()
    })

    describe('execute', () => {
      it.each([
        [[evaluable(false), evaluable(false)], false],
        [[evaluable(true), evaluable(false)], true],
        [[evaluable([match]), evaluable(false)], [match]],
        [[evaluable(false), evaluable(true)], true],
        [[evaluable(true), evaluable(true)], false],
        [[evaluable(false), evaluable(true), evaluable(false)], true],
        [[evaluable(false), evaluable([match]), evaluable(false)], [match]],
        [[evaluable(true), evaluable(false), evaluable(true)], false],
      ])('operands %p should be executed as %s', (operands, expected) => {
        expect(xor(...operands).execute('')).toStrictEqual(expected)
      })

      it.each([[[evaluable(true), evaluable(false)], jest.fn(), true]])(
        'operands %p with tap %p should be executed as %s',
        (operands, tap, expected) => {
          expect(xor(...operands).execute('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('test', () => {
      it.each([
        [[evaluable(false), evaluable(false)], false],
        [[evaluable(true), evaluable(false)], true],
        [[evaluable(false), evaluable(true)], true],
        [[evaluable(true), evaluable(true)], false],
        [[evaluable(false), evaluable(true), evaluable(false)], true],
        [[evaluable(true), evaluable(false), evaluable(true)], false],
      ])('operands %p should be tested as %s', (operands, expected) => {
        expect(xor(...operands).test('')).toStrictEqual(expected)
      })
    })

    describe('toString', () => {
      it.each([
        [undefined, '(Evaluable XOR Evaluable)'],
        [
          (...operands: Serializable[]) =>
            operands.map((operand) => operand.toString()).join(' ⊻ '),
          'Evaluable ⊻ Evaluable',
        ],
      ])('format %p should be produce %s', (format, expected) => {
        expect(xor(evaluable(true), evaluable(true)).toString(format)).toBe(
          expected
        )
      })
    })
  })
})
