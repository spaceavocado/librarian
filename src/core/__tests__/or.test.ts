import { Evaluable, Serializable } from '../Evaluable'
import { or } from '../or'

describe('librarian / core', () => {
  describe('or', () => {
    const yes: Evaluable = {
      id: Symbol(),
      evaluate: () => [],
      toString: () => 'Yes',
    }
    const no: Evaluable = { id: Symbol(), evaluate: () => false }

    describe('evaluate', () => {
      it.each([
        [[yes], []],
        [[no], false],
        [[yes, no], []],
        [[no, no], false],
      ])('operands %p should be evaluated as %s', (operands, expected) => {
        expect(or(...operands).evaluate('')).toStrictEqual(expected)
      })

      it.each([[[yes], jest.fn(), []]])(
        'operands %p with tap %p should be evaluated as %s',
        (operands, tap, expected) => {
          expect(or(...operands).evaluate('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
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
