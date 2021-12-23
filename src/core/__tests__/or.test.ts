import { OR, or } from '..'
import { Evaluable, Serializable } from '../Evaluable'

describe('librarian / core', () => {
  describe('or', () => {
    const yes: Evaluable = {
      id: Symbol(),
      kind: OR,
      execute: () => [],
      test: () => false,
      toString: () => 'Yes',
    }
    const no: Evaluable = {
      id: Symbol(),
      kind: OR,
      execute: () => false,
      test: () => false,
    }

    test('constructor', () => {
      expect(() => or()).toThrow()
      expect(() => or(yes)).toThrow()
    })

    describe('execute', () => {
      it.each([
        [[no, no], false],
        [[yes, no], []],
        [[no, yes], []],
        [[yes, yes], []],
      ])('operands %p should be executed as %s', (operands, expected) => {
        expect(or(...operands).execute('')).toStrictEqual(expected)
      })

      it.each([[[yes, yes], jest.fn(), []]])(
        'operands %p with tap %p should be executed as %s',
        (operands, tap, expected) => {
          expect(or(...operands).execute('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('test', () => {
      it.each([
        [[no, no], false],
        [[no, yes], true],
        [[yes, no], true],
        [[yes, yes], true],
      ])('operands %p should be tested as %s', (operands, expected) => {
        expect(or(...operands).test('')).toStrictEqual(expected)
      })
    })

    describe('toString', () => {
      it.each([
        [undefined, '(Yes OR Yes)'],
        [
          (...operands: Serializable[]) =>
            operands.map((operand) => operand.toString()).join(' || '),
          'Yes || Yes',
        ],
      ])('format %p should be produce %s', (format, expected) => {
        expect(or(yes, yes).toString(format)).toBe(expected)
      })
    })
  })
})
