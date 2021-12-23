import { XOR, xor } from '..'
import { Evaluable, Serializable } from '../Evaluable'

describe('librarian / core', () => {
  describe('xor', () => {
    const yes: Evaluable = {
      id: Symbol(),
      kind: XOR,
      execute: () => [],
      test: () => false,
      toString: () => 'Yes',
    }
    const no: Evaluable = {
      id: Symbol(),
      kind: XOR,
      execute: () => false,
      test: () => false,
    }

    test('constructor', () => {
      expect(() => xor()).toThrow()
      expect(() => xor(yes)).toThrow()
    })

    describe('execute', () => {
      it.each([
        [[no, no], false],
        [[yes, no], []],
        [[no, yes], []],
        [[yes, yes], false],
        [[no, yes, no], []],
        [[yes, no, yes], false],
      ])('operands %p should be executed as %s', (operands, expected) => {
        expect(xor(...operands).execute('')).toStrictEqual(expected)
      })

      it.each([[[yes, no], jest.fn(), []]])(
        'operands %p with tap %p should be executed as %s',
        (operands, tap, expected) => {
          expect(xor(...operands).execute('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('test', () => {
      it.each([
        [[no, no], false],
        [[yes, no], true],
        [[no, yes], true],
        [[yes, yes], false],
        [[no, yes, no], true],
        [[yes, no, yes], false],
      ])('operands %p should be tested as %s', (operands, expected) => {
        expect(xor(...operands).test('')).toStrictEqual(expected)
      })
    })

    describe('toString', () => {
      it.each([
        [undefined, '(Yes XOR Yes)'],
        [
          (...operands: Serializable[]) =>
            operands.map((operand) => operand.toString()).join(' ⊻ '),
          'Yes ⊻ Yes',
        ],
      ])('format %p should be produce %s', (format, expected) => {
        expect(xor(yes, yes).toString(format)).toBe(expected)
      })
    })
  })
})
