import { NOR, nor } from '..'
import { Evaluable, Serializable } from '../Evaluable'

describe('librarian / core', () => {
  describe('nor', () => {
    const yes: Evaluable = {
      id: Symbol(),
      kind: NOR,
      execute: () => [],
      test: () => false,
      toString: () => 'Yes',
    }
    const no: Evaluable = {
      id: Symbol(),
      kind: NOR,
      execute: () => false,
      test: () => false,
    }

    test('constructor', () => {
      expect(() => nor()).toThrow()
      expect(() => nor(yes)).toThrow()
    })

    describe('execute', () => {
      it.each([
        [[no, no], []],
        [[yes, no], false],
        [[no, yes], false],
        [[yes, yes], false],
      ])('operands %p should be executed as %s', (operands, expected) => {
        expect(nor(...operands).execute('')).toStrictEqual(expected)
      })

      it.each([[[no, no], jest.fn(), []]])(
        'operands %p with tap %p should be executed as %s',
        (operands, tap, expected) => {
          expect(nor(...operands).execute('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('test', () => {
      it.each([
        [[no, no], true],
        [[yes, no], false],
        [[no, yes], false],
        [[yes, yes], false],
      ])('operands %p should be tested as %s', (operands, expected) => {
        expect(nor(...operands).test('')).toStrictEqual(expected)
      })
    })

    describe('toString', () => {
      it.each([
        [undefined, '(Yes NOR Yes)'],
        [
          (...operands: Serializable[]) =>
            operands.map((operand) => operand.toString()).join(' ↓ '),
          'Yes ↓ Yes',
        ],
      ])('format %p should be produce %s', (format, expected) => {
        expect(nor(yes, yes).toString(format)).toBe(expected)
      })
    })
  })
})
