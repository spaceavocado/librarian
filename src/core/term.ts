import { pipe, replace } from '../internal'
import { Evaluable } from '.'
import { Match } from './Match'

export const isAdvancedTerm = (term: string): boolean =>
  term.match(/(?<!\\)\*|(?<!\\)\?/) !== null

export const advancedTermRx = (term: string): string =>
  // Escaped wildcard characters are preserved via a temporary
  // substitution with these ASCII characters:
  // \xBC (¼)
  // \xBD (½)
  pipe(
    replace(/\\\*/g, '\xBC'),
    replace(/\\\?/g, '\xBD'),
    replace(/\*{2,}/g, '*'),
    replace(/\*/g, '\\w+'),
    replace(/\?/g, '.'),
    replace(/\xBC/g, '\\*'),
    replace(/\xBD/g, '\\?')
  )(term)

export const plainTerm =
  (term: string) =>
  (context: string): false | Match[] =>
    ((needle, haystack) => {
      let index = -1
      let start = 0
      const matches: Match[] = []

      for (;;) {
        index = haystack.indexOf(needle, start)
        if (index === -1) {
          break
        }

        matches.push({
          match: context.slice(index, index + term.length),
          index,
          length: term.length,
        })
        start += index + term.length
      }

      return matches.length ? matches : false
    })(term.toLowerCase(), context.toLowerCase())

export const advancedTerm =
  (term: string) =>
  (context: string): false | Match[] =>
    ((rx) => {
      const matches: Match[] = []

      for (;;) {
        const match = rx.exec(context)
        if (match === null) {
          break
        }

        matches.push({
          index: match.index,
          length: match[0].length,
          match: match[0],
        })
      }

      return matches.length ? matches : false
    })(new RegExp(advancedTermRx(term), 'ig'))

/**
 * Supported wildcards:
 *
 * An asterisk (*) may be used to specify any number of characters.
 * It is typically used at the end of a root word, when it is
 * referred to as "truncation." This is great when you want to search
 * for variable endings of a root word.
 * - (*) matches any word character (equivalent to [a-zA-Z0-9_])
 *
 * A question mark (?) may be used to represent a single character,
 * anywhere in the word. It is most useful when there are variable
 * spellings for a word, and you want to search for all variants at once.
 * For example, searching for colo?r would return both color and colour.
 * - (?) matches any character (except for line terminators)
 */
export const term = (term: string): Evaluable => ({
  toString: () => `"${term}"`,
  evaluate: isAdvancedTerm(term) ? advancedTerm(term) : plainTerm(term),
})
