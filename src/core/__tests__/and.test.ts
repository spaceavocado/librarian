import { and } from '../and'
import { Evaluable } from '../Evaluable'

describe('librarian / core', () => {
  describe('and', () => {
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
        [[yes, no], false],
        [[yes, yes], []],
      ])('operands %p should be evaluated as %s', (operands, expected) => {
        expect(and(...operands).evaluate('')).toStrictEqual(expected)
      })

      it.each([[[yes], jest.fn(), []]])(
        'operands %p with tap %p should be evaluated as %s',
        (operands, tap, expected) => {
          expect(and(...operands).evaluate('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('toString', () => {
      it.each([
        [undefined, '(Yes AND Yes)'],
        [(operand: string) => `$${operand}`, '($Yes AND $Yes)'],
      ])('format %p should be produce %s', (format, expected) => {
        expect(and(yes, yes).toString(format)).toBe(expected)
      })
    })
  })
})
