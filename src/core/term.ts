import { identity, pipe, replace, tap, toLower } from '../internal'
import { Evaluable } from './Evaluable'
import { Match } from './Match'

export const isAdvancedTerm =
  (escapeChar: string) =>
  (...specialChars: string[]) =>
  (term: string): boolean => {
    let tail = term[0] ?? ''
    for (const char of term) {
      if (tail !== escapeChar && specialChars.includes(char)) {
        return true
      }
      tail = char
    }
    return false
  }

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
    replace(/\?/g, '\\w'),
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
          term,
          match: context.slice(index, index + term.length),
          index,
          length: needle.length,
        })
        start = index + needle.length
      }

      return matches.length ? matches : false
    })(pipe(toLower, replace(/\\(\*|\?)/g, '$1'))(term), context.toLowerCase())

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
          term,
          match: match[0],
          index: match.index,
          length: match[0].length,
        })
      }

      return matches.length ? matches : false
    })(new RegExp(advancedTermRx(term), 'ig'))

export const TERM = 'TERM'

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
export const term = (term: string): Evaluable =>
  ((id, evaluate) => ({
    id,
    kind: TERM,
    execute: function (context, onEvaluation) {
      return pipe(
        evaluate,
        onEvaluation ? tap((result) => onEvaluation(this, result)) : identity
      )(context)
    },
    test: function (context) {
      return this.execute(context) !== false
    },
    toString: (format = (term) => `"${term}"`) => format(term),
  }))(
    Symbol(TERM),
    isAdvancedTerm('\\')('*', '?')(term) ? advancedTerm(term) : plainTerm(term)
  )
