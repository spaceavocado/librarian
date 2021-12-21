import { Evaluable } from '../core'
import {
  parse,
  readOperatorBuffer,
  reduceOperands,
  setExclusiveOperator,
} from '../parse'

describe('librarian / parser', () => {
  describe('readOperatorBuffer', () => {
    it.each([
      [null, 'a', null],
      ['', 'a', ''],
      ['A', 'a', 'A'],
      [null, 'A', 'A'],
      ['', 'A', 'A'],
      ['A', 'B', 'AB'],
    ])('for buffer %p, char %p read buffer as %s', (buffer, char, expected) => {
      expect(readOperatorBuffer(buffer, char)).toBe(expected)
    })
  })

  describe('setExclusiveOperator', () => {
    it.each([
      [false, undefined, 'NOT', undefined],
      [true, undefined, 'AND', 'AND'],
      [true, 'AND', 'AND', 'AND'],
    ])(
      'exclusive %p operator, with previous %p state, changing to &p state should return as %p',
      (exclusive, previous, pending, expected) => {
        expect(setExclusiveOperator(exclusive)(previous, pending)).toBe(
          expected
        )
      }
    )

    it.each([['AND', 'OR']])(
      'exclusive operator, with previous %p state, changing to &p state should throw an error',
      (previous, pending) => {
        expect(() => setExclusiveOperator(true)(previous, pending)).toThrow(
          'exclusive logical operators cannot be combined within the same scope'
        )
      }
    )
  })

  test('reduceOperands', () => {
    const combined: (operands: Evaluable[]) => Evaluable = () => ({
      id: Symbol(),
      kind: '',
      toString: () => 'COMBINED',
      evaluate: () => false,
    })
    const single: Evaluable = {
      id: Symbol(),
      kind: '',
      toString: () => 'SINGLE',
      evaluate: () => false,
    }

    expect(reduceOperands(combined)([single]).toString()).toBe('SINGLE')
    expect(reduceOperands(combined)([single, single]).toString()).toBe(
      'COMBINED'
    )
  })

  describe('parse', () => {
    it.each([
      // Plain term
      ['"Blue"', '"Blue"'],
      ['("Blue")', '"Blue"'],
      // AND
      ['"Blue" AND "City"', '("Blue" AND "City")'],
      ['"Blue" AND "City" AND "Dog"', '("Blue" AND "City" AND "Dog")'],
      // OR
      ['"Blue" OR "City"', '("Blue" OR "City")'],
      ['"Blue" OR "City" OR "Dog"', '("Blue" OR "City" OR "Dog")'],
      // NOT
      ['NOT "Blue"', 'NOT "Blue"'],
      // Scopes
      ['"Blue" OR ("City" AND "Dog")', '("Blue" OR ("City" AND "Dog"))'],
      [
        '"Blue" AND NOT ("City" AND "Dog")',
        '("Blue" AND NOT ("City" AND "Dog"))',
      ],
      [
        '"Blue" OR ("City" AND (NOT "Dog" OR "Audi"))',
        '("Blue" OR ("City" AND (NOT "Dog" OR "Audi")))',
      ],
      // Escaping
      ['"Blue \\"jack\\" bird"', '"Blue \\"jack\\" bird"'],
      ['"\\"Blue"', '"\\"Blue"'],
      // Edge cases - Non-terminating
      ['"Blue" AND "Peter', '"Blue"'],
      ['"Blue" AND (())', '"Blue"'],
      ['"Blue" ))(', '"Blue"'],
    ])('input %p should be parsed as %s', (input, expected) => {
      expect(parse(input).toString()).toBe(expected)
    })

    it.each([
      // Mixed logical terms within the same scope
      [
        '"Blue" AND "Red" OR "Yellow"',
        'exclusive logical operators cannot be combined within the same scope',
      ],
      // Unterminated term, hard error
      ['"Blue', 'invalid syntax: "Blue'],
      ['AND', 'invalid syntax: AND'],
    ])('input %p should throw an error', (input, error) => {
      expect(() => parse(input)).toThrow(error)
    })
  })
})
