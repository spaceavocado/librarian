import {
  advancedTerm,
  advancedTermRx,
  isAdvancedTerm,
  plainTerm,
  term,
} from '../term'

describe('librarian / core', () => {
  describe('isAdvancedTerm', () => {
    it.each([
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
      expect(isAdvancedTerm(term)).toStrictEqual(expected)
    })
  })

  describe('advancedTermRx', () => {
    it.each([
      ['colo*', 'colo\\w+'],
      ['colo***', 'colo\\w+'],
      ['*color', '\\w+color'],
      ['c*lor', 'c\\w+lor'],
      ['c*l\\*r', 'c\\w+l\\*r'],
      ['col??', 'col..'],
      ['col?\\?', 'col.\\?'],
    ])('advanced term %p in rx form: %p', (term, expected) => {
      expect(advancedTermRx(term)).toStrictEqual(expected)
    })
  })

  describe('plainTerm', () => {
    it.each([
      ['Blue', 'Red', false],
      ['dog', 'Peter has a dog.', [{ index: 12, length: 3, match: 'dog' }]],
      [
        'dog',
        "Peter's dog has a Dog.",
        [
          { index: 8, length: 3, match: 'dog' },
          { index: 18, length: 3, match: 'Dog' },
        ],
      ],
    ])(
      'plain term %p in context %p should be evaluated as %s',
      (needle, context, expected) => {
        expect(plainTerm(needle)(context)).toStrictEqual(expected)
      }
    )
  })

  describe('advancedTerm', () => {
    it.each([
      // An asterisk (*)
      [
        'cent*',
        'The city center, around area centre.',
        [
          { index: 9, length: 6, match: 'center' },
          { index: 29, length: 6, match: 'centre' },
        ],
      ],
      [
        '*ter',
        'Peter walks towards the center.',
        [
          { index: 0, length: 5, match: 'Peter' },
          { index: 24, length: 6, match: 'center' },
        ],
      ],
      [
        'b*r',
        'The bear holds a beer in his paws.',
        [
          { index: 4, length: 4, match: 'bear' },
          { index: 17, length: 4, match: 'beer' },
        ],
      ],
      [
        '\\* important n**',
        '* important note:',
        [{ index: 0, length: 16, match: '* important note' }],
      ],
      [
        // A question mark (?)
        'cent??',
        'The city center, around area Centre.',
        [
          { index: 9, length: 6, match: 'center' },
          { index: 29, length: 6, match: 'Centre' },
        ],
      ],
      [
        'b?t',
        'A bit on a bot, beet.',
        [
          { index: 2, length: 3, match: 'bit' },
          { index: 11, length: 3, match: 'bot' },
        ],
      ],
      ['b?t\\?', 'A bit on a bot?.', [{ index: 11, length: 4, match: 'bot?' }]],
    ])(
      'advanced term %p in context %p should be evaluated as %s',
      (needle, context, expected) => {
        expect(advancedTerm(needle)(context)).toStrictEqual(expected)
      }
    )
  })

  describe('term', () => {
    it.each([
      ['Blue', 'Red', false],
      ['cent*', 'The city center', [{ index: 9, length: 6, match: 'center' }]],
    ])(
      'term %p in context %p should be evaluated as %s',
      (needle, context, expected) => {
        expect(term(needle).evaluate(context)).toStrictEqual(expected)
      }
    )
  })
})
