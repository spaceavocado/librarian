import { Serializable } from '../Evaluable'
import {
  advancedTerm,
  advancedTermRx,
  isAdvancedTerm,
  plainTerm,
  term,
} from '../term'

describe('librarian / core', () => {
  describe('term', () => {
    describe('isAdvancedTerm', () => {
      it.each([
        ['', false],
        ['*', true],
        ['?', true],
        ['Blue', false],
        ['Blu*', true],
        ['*lue', true],
        ['Blu**', true],
        ['Blu\\*', false],
        ['\\*lue', false],
        ['\\**lue', true],
        ['Bl?e', true],
        ['Bl\\?e', false],
      ])('term %p in advanced term: %p', (term, expected) => {
        expect(isAdvancedTerm('\\')('*', '?')(term)).toStrictEqual(expected)
      })
    })

    describe('advancedTermRx', () => {
      it.each([
        ['colo*', 'colo\\w+'],
        ['colo***', 'colo\\w+'],
        ['*color', '\\w+color'],
        ['c*lor', 'c\\w+lor'],
        ['c*l\\*r', 'c\\w+l\\*r'],
        ['col??', 'col\\w\\w'],
        ['col?\\?', 'col\\w\\?'],
      ])('advanced term %p in rx form: %p', (term, expected) => {
        expect(advancedTermRx(term)).toStrictEqual(expected)
      })
    })

    describe('plainTerm', () => {
      it.each([
        ['Blue', 'Red', false],
        [
          'dog',
          'Peter has a dog.',
          [{ index: 12, length: 3, match: 'dog', term: 'dog' }],
        ],
        [
          'dog',
          "Peter's dog has a Dog.",
          [
            { index: 8, length: 3, match: 'dog', term: 'dog' },
            { index: 18, length: 3, match: 'Dog', term: 'dog' },
          ],
        ],
        ['Blue\\*', 'Blues', false],
        [
          'Blue\\*',
          'Blue*',
          [{ index: 0, length: 5, match: 'Blue*', term: 'Blue\\*' }],
        ],
        ['Blue\\? and Red\\?', 'Blues and Reds', false],
        [
          'Blue\\? and Red\\?',
          'Blue? and Red?',
          [
            {
              index: 0,
              length: 14,
              match: 'Blue? and Red?',
              term: 'Blue\\? and Red\\?',
            },
          ],
        ],
      ])(
        'plain term %p in context %p should be executed as %s',
        (needle, context, expected) => {
          expect(plainTerm(needle)(context)).toStrictEqual(expected)
        }
      )
    })

    describe('advancedTerm', () => {
      it.each([
        ['cent*', 'Red', false],
        // An asterisk (*)
        [
          'cent*',
          'The city center, around area centre.',
          [
            { index: 9, length: 6, match: 'center', term: 'cent*' },
            { index: 29, length: 6, match: 'centre', term: 'cent*' },
          ],
        ],
        [
          '*ter',
          'Peter walks towards the center.',
          [
            { index: 0, length: 5, match: 'Peter', term: '*ter' },
            { index: 24, length: 6, match: 'center', term: '*ter' },
          ],
        ],
        [
          'b*r',
          'The bear holds a beer in his paws.',
          [
            { index: 4, length: 4, match: 'bear', term: 'b*r' },
            { index: 17, length: 4, match: 'beer', term: 'b*r' },
          ],
        ],
        [
          '\\* important n**',
          '* important note:',
          [
            {
              index: 0,
              length: 16,
              match: '* important note',
              term: '\\* important n**',
            },
          ],
        ],
        [
          // A question mark (?)
          'cent??',
          'The city center, around area Centre.',
          [
            { index: 9, length: 6, match: 'center', term: 'cent??' },
            { index: 29, length: 6, match: 'Centre', term: 'cent??' },
          ],
        ],
        [
          'b?t',
          'A bit on a bot, beet.',
          [
            { index: 2, length: 3, match: 'bit', term: 'b?t' },
            { index: 11, length: 3, match: 'bot', term: 'b?t' },
          ],
        ],
        [
          'b?t\\?',
          'A bit on a bot?.',
          [{ index: 11, length: 4, match: 'bot?', term: 'b?t\\?' }],
        ],
      ])(
        'advanced term %p in context %p should be executed as %s',
        (needle, context, expected) => {
          expect(advancedTerm(needle)(context)).toStrictEqual(expected)
        }
      )
    })

    describe('execute', () => {
      it.each([
        ['Blue', 'Red', false],
        [
          'cent*',
          'The city center',
          [{ index: 9, length: 6, match: 'center', term: 'cent*' }],
        ],
      ])(
        'term %p in context %p should be executed as %s',
        (needle, context, expected) => {
          expect(term(needle).execute(context)).toStrictEqual(expected)
        }
      )

      it.each([['Blue', jest.fn(), false]])(
        'term %p with tap %p should be executed as %s',
        (needle, tap, expected) => {
          expect(term(needle).execute('', tap)).toStrictEqual(expected)
          expect(tap.mock.calls[0][1]).toStrictEqual(expected)
        }
      )
    })

    describe('test', () => {
      it.each([
        ['Blue', 'Red', false],
        ['cent*', 'The city center', true],
      ])(
        'term %p in context %p should be tested as %s',
        (needle, context, expected) => {
          expect(term(needle).test(context)).toStrictEqual(expected)
        }
      )
    })

    describe('toString', () => {
      it.each([
        ['dog', undefined, '"dog"'],
        ['dog', (operand: Serializable) => `$${operand}`, '$dog'],
      ])(
        'term %p using format %p should be produce %s',
        (needle, format, expected) => {
          expect(term(needle).toString(format)).toBe(expected)
        }
      )
    })
  })
})
