import { AND, and, TERM } from '..'
import { Evaluable, Serializable } from '../Evaluable'

describe('librarian / core', () => {
  describe('and', () => {
    const yes: Evaluable = {
      id: Symbol(),
      kind: AND,
      execute: () => [],
      test: () => false,
      toString: () => 'Yes',
    }
    const no: Evaluable = {
      id: Symbol(),
      kind: TERM,
      execute: () => false,
      test: () => false,
    }

    describe('execute', () => {
      it.each([
        [[yes], []],
        [[no], false],
        [[yes, no], false],
        [[yes, yes], []],
      ])('operands %p should be executed as %s', (operands, expected) => {
        expect(and(...operands).execute('')).toStrictEqual(expected)
      })

      it.each([[[yes], jest.fn(), []]])(
        'operands %p with tap %p should be executed as %s',
        (operands, tap, expected) => {
          expect(and(...operands).execute('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('test', () => {
      it.each([
        [[yes], true],
        [[no], false],
        [[yes, no], false],
        [[yes, yes], true],
      ])('operands %p should be tested as %s', (operands, expected) => {
        expect(and(...operands).test('')).toStrictEqual(expected)
      })
    })

    describe('toString', () => {
      it.each([
        [undefined, '(Yes AND Yes)'],
        [
          (...operands: Serializable[]) =>
            operands.map((operand) => operand.toString()).join(' && '),
          'Yes && Yes',
        ],
      ])('format %p should be produce %s', (format, expected) => {
        expect(and(yes, yes).toString(format)).toBe(expected)
      })
    })
  })
})
