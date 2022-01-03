# Librarian

A micro search library leveraging [Boolean Operators](https://library.alliant.edu/screens/boolean.pdf), supporting [wildcard](https://apus.libanswers.com/faq/2235) annotation within search terms.

> Revision: Jan 3, 2022.

## Installation

Npm package: [@spaceavocado/librarian](https://www.npmjs.com/package/@spaceavocado/librarian).

```sh
npm install @spaceavocado/librarian
yarn add @spaceavocado/librarian
```

> The library is being build as **CommonJS** module and **ESM**.

## Online Sandbox

The library could be tested in the online sandbox [https://librarian-sandbox.web.app/](https://librarian-sandbox.web.app/).

## Usage

An evaluable search expression could be created directly from the evaluable core expression functions or parsed from the raw expression input.

### Evaluable / Expression Data Model

```ts
type Evaluable = {
  // Convert the expression to a literal expression string
  toString: (format?: (...arg: Serializable[]) => string) => string
  // Test if there are any matches within the given context
  test: (context: string) => boolean
  // Execute the expression within the given context and get fond matches, if any.
  execute: (context: string, onEvaluation?: Evaluation) => EvaluationResult
}
```

- `EvaluationResult: Match[]` = Matches found within the context.
- `EvaluationResult: true` = Evaluated as matching within the context, without any direct match records (NOT operand).
- `EvaluationResult: false` = Not matches found within the context.

```ts
import { term, and, or, not, nor, xor, parse } from '@spaceavocado/librarian'
// term(), and(), or(), nor(), xor(), not(), parse() return an "Evaluable"
```

### Raw Expression Parsing

```ts
import { parse } from '@spaceavocado/librarian'

// Parse raw expression into a search function
const search = parse('"cent??" AND ("new york" OR "berlin")').execute

// Perform a search
const result1 = search("Christie visited the New York's city center last week.")

// The result1 contains a collection of librarian.Match results
;[
  { match: 'center', term: 'cent??', index: 37, length: 6 },
  { match: 'New York', term: 'new york', index: 21, length: 8 },
]

// Perform a search
const result2 = search(
  "Christie visited the New York's city outskirt last week."
)

// The result2 is false, as there are not found matches
false
```

### Search Expression Evaluable

```ts
import { term, and, or, not } from '@spaceavocado/librarian'

// Create the search function from the search expression handlers
const search = and(term('cent??'), or(term('new york'), term('berlin'))).execute

// Perform a search
const result1 = search("Christie visited the New York's city center last week.")

// The result1 contains a collection of librarian.Match results
;[
  { match: 'center', term: 'cent??', index: 37, length: 6 },
  { match: 'New York', term: 'new york', index: 21, length: 8 },
]

// Perform a search
const result2 = search(
  "Christie visited the New York's city outskirt last week."
)

// The result2 is false, as there are not found matches
false
```

## Literal Form of an Expression

```ts
import { parse, term, and, or } from '@spaceavocado/librarian'

const expression1 = and(
  term('cent??'),
  or(term('new york'), term('berlin'))
).toString()

const expression2 = parse('"cent??" AND ("new york" OR "berlin")').toString()

// The literal form of the expression1
;('("cent?? AND ("new york" OR "berlin")")')

// The literal form of the expression2
;('("cent?? AND ("new york" OR "berlin")")')
```

**Note**: `toString` method could be provided with a custom formatting function.

## Boolean Operators

### AND

Requires all terms to be found within the search context.

#### Examples

_Search Context:_

```
The NASA Juno mission, which began orbiting Jupiter in July 2016, just recently made its 38th close flyby of the gas giant. The mission was extended earlier this year, adding on a flyby of Jupiter's moon Ganymede in June.
```

**Search expression 1:** `"nasa" AND "mission" AND "ganymede"`

- _Result_: **Match**, all terms are present in the search context.

**Search expression 2:** `"nasa" AND "august"`

- _Result_: **No Match**, "nasa" is present within the search context, but "august" is not.

#### Usage

```ts
import { term, and } from '@spaceavocado/librarian'

const search = and(term('new york'), term('berlin')).execute
const search = parse('"new york" AND "berlin"').execute

const result = search("Christie visited the New York's city center last week.")
```

### OR

Requires at least one term to be found within the search context.

#### Examples

_Search Context:_

```
The NASA Juno mission, which began orbiting Jupiter in July 2016, just recently made its 38th close flyby of the gas giant. The mission was extended earlier this year, adding on a flyby of Jupiter's moon Ganymede in June.
```

**Search expression 1:** `"nasa" OR "mission" OR "ganymede"`

- _Result_: **Match**, all terms are present in the search context.

**Search expression 2:** `"nasa" AND "august"`

- _Result_: **Match**, "nasa" is present within the search context, "august" is not, but at least one term is present.

**Search expression 3:** `"spacex" AND "august"`

- _Result_: **No Match**, "spacex" nor "august" is present within the search context.

#### Usage

```ts
import { term, or } from '@spaceavocado/librarian'

const search = or(term('new york'), term('berlin')).execute
const search = parse('"new york" OR "berlin"').execute

const result = search("Christie visited the New York's city center last week.")
```

### NOR (Negative OR)

Requires no terms to be found within the search context.

#### Examples

_Search Context:_

```
The NASA Juno mission, which began orbiting Jupiter in July 2016, just recently made its 38th close flyby of the gas giant. The mission was extended earlier this year, adding on a flyby of Jupiter's moon Ganymede in June.
```

**Search expression 1:** `"nasa" NOR "mission" NOR "ganymede"`

- _Result_: **NO Match**, "nasa" is present within the search context.

**Search expression 2:** `"spacex" NOR "year"`

- _Result_: **NO Match**, "year" is present within the search context.

**Search expression 3:** `"spacex" NOR "august"`

- _Result_: **Match**, "spacex" nor "august" is present within the search context.

#### Usage

```ts
import { term, nor } from '@spaceavocado/librarian'

const search = nor(term('new york'), term('berlin')).execute
const search = parse('"new york" NOR "berlin"').execute

const result = search("Christie visited the New York's city center last week.")
```

### XOR (Exclusive OR)

Requires exactly one term to be found within the search context.

#### Examples

_Search Context:_

```
The NASA Juno mission, which began orbiting Jupiter in July 2016, just recently made its 38th close flyby of the gas giant. The mission was extended earlier this year, adding on a flyby of Jupiter's moon Ganymede in June.
```

**Search expression 1:** `"nasa" XOR "mission" XOR "august"`

- _Result_: **NO Match**, "nasa" and "mission" is present within the search context.

**Search expression 2:** `"spacex" XOR "august"`

- _Result_: **NO Match**, "spacex" nor "august" is present within the search context.

**Search expression 3:** `"spacex" XOR "august" XOR "mission"`

- _Result_: **Match**, only "mission" is present within the search context.

#### Usage

```ts
import { term, xor } from '@spaceavocado/librarian'

const search = xor(term('new york'), term('berlin')).execute
const search = parse('"new york" XOR "berlin"').execute

const result = search("Christie visited the New York's city center last week.")
```

### NOT

Flips the outcome of AND, OR operators and/or result of the search term.

#### Examples

_Search Context:_

```
The NASA Juno mission, which began orbiting Jupiter in July 2016, just recently made its 38th close flyby of the gas giant. The mission was extended earlier this year, adding on a flyby of Jupiter's moon Ganymede in June.
```

**Search expression 1:** `NOT "spacex"`

- _Result_: **Match**, "spacex" is NOT present in the search context.

**Search expression 2:** `NOT "nasa"`

- _Result_: **No Match**, "nasa" is present in the search context.

**Search expression 3:** `"nasa" AND NOT "spacex"`

- _Result_: **Match**, "nasa" is present, and "spacex" is NOT present in the search context.

**Search expression 3:** `"nasa" AND NOT ("spacex" OR "galactic")`

- _Result_: **Match**, "nasa" is present, and "spacex" or "galactic" are NOT present in the search context.

#### Usage

```ts
import { term, not } from '@spaceavocado/librarian'

const search = not(term('new york')).execute
const search = parse('NOT "new york"').execute
const search = parse('"new york" AND NOT ("center" AND NOT "week")').execute

const result = search("Christie visited the New York's city center last week.")
```

### AND, OR, XOR, NOR Exclusiveness Within the Same Scope

`AND`, `OR`, `NOR`, `XOR` operators cannot be mixed within the same expression scope, they could be combined only within different scope of the search expression. See [Search Expression Scoping/Nesting](#search-expression-scopingnesting) for more details.

**Examples:**

- **VALID**: `"animal" AND ("cat" OR "dog" OR "bird")`
- **INVALID**: `"animal" AND "cat" OR "dog"`
- **VALID**: `"animal" OR ("cat" AND "dog")`
- **INVALID**: `"animal" OR "cat" AND "dog"`

## Wildcards

### An Asterisk (\*)

An asterisk (\*) may be used to specify any number of characters. It is typically used at the end of a root word, when it is referred to as "truncation." This is great when you want to search for variable endings of a root word.

**Note:** (\*) matches any word character (equivalent to `[a-zA-Z0-9_]`)

**Examples:**

- `cent*` matches: cent**er**, cent**re**
- `*fix` matches: **pre**fix, **suf**fix
- `b*r` matches: b**ee**r, b**ea**r

#### Usage

```ts
import { term } from '@spaceavocado/librarian'

const search = term('cent*').execute
const search = parse('"cent*"').execute

const result = search("Christie visited the New York's city center last week.")
```

### A Question Mark (?)

A question mark (?) may be used to represent a single character, anywhere in the word. It is most useful when there are variable spellings for a word, and you want to search for all variants at once.For example, searching for colo?r would return both color and colour.

**Note:** (?) matches any word character (equivalent to `[a-zA-Z0-9_]`)

**Examples:**

- `cent??` matches: cent**er**, cent**re** but NOT ~cents~
- `???fix` matches: **pre**fix, **suf**fix but NOT ~affix~
- `b??r` matches: b**ee**r, b**ea**r but NOT ~bor~

#### Usage

```ts
import { term } from '@spaceavocado/librarian'

const search = term('cent??').execute
const search = parse('"cent??"').execute

const result = search("Christie visited the New York's city center last week.")
```

## Search Expression Scoping/Nesting

The parentheses, `(` `)`, are used to enclose the nested search expressions.

**Example:** `"red" AND ("cat" OR "dog")`

### Root Expression Parentheses

The root expression could be optionally enclosed within parentheses. E.g.: `"cat" OR "dog"` = `("cat" OR "dog")`

### Unlimited Scoping/Nesting

The search expressions could be nested without any limitation. E.g.: `"animal" AND ("tiger" OR ("snail" AND "african"))`

## Case Insensitivity

The search terms are not case sensitive. i.e. `"cat"` finds `cat`, `Cat` and/or `CAT`.

## Evaluation Probe

Probe captures provides information about the whole expression evaluation tree.

```ts
import { parse, term, and, or } from '@spaceavocado/librarian'

const expression = and(
  term('cent??'),
  or(term('new york'), term('berlin'))
)

const search = probe(expression).execute

// Perform a search with probe data
const [result1, probeData1] = search("Christie visited the New York's city center last week.")

// The result1 contains a collection of librarian.Match results
;[
  { match: 'center', term: 'cent??', index: 37, length: 6 },
  { match: 'New York', term: 'new york', index: 21, length: 8 },
]

// The probeData1 contains librarian.ProbeResult
;{
  id: Symbol(and),
  toString: [Function: toString],
  execute: [Function: execute],
  test: [Function: test],
  result: [
    { term: 'cent??', match: 'center', index: 37, length: 6 },
    { term: 'new york', match: 'New York', index: 21, length: 8 }
  ],
  descendants: [
    {
      id: Symbol(term),
      toString: [Function: toString],
      execute: [Function: execute],
      test: [Function: test],
      result: [
        { term: 'cent??', match: 'center', index: 37, length: 6 }
      ],
      descendants: []
    },
    {
      id: Symbol(or),
      toString: [Function: toString],
      execute: [Function: execute],
      test: [Function: test],
      result: [
        { term: 'new york', match: 'New York', index: 21, length: 8 }
      ],
      descendants: [
        {
          id: Symbol(term),
          toString: [Function: toString],
          execute: [Function: execute],
          test: [Function: test],
          result: [
            { term: 'new york', match: 'New York', index: 21, length: 8 }
          ],
          descendants: []
        },
        {
          id: Symbol(term),
          toString: [Function: toString],
          execute: [Function: execute],
          test: [Function: test],
          descendants: []
        }
      ],
    }
  ]
}
```

- `result: Match[]` = Matches found within the context.
- `result: false` = Not matches found within the context.
- `result: undefined` = The evaluable has not been executed, i.e this expression branch has not been needed to be executed.

---

## Contributing

See [contributing.md](contributing.md).

## License

Librarian is released under the MIT license. See [license.txt](license.txt).
