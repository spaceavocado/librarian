# Librarian

A micro search library leveraging [Boolean Operators](https://library.alliant.edu/screens/boolean.pdf), supporting [wildcard](https://apus.libanswers.com/faq/2235) annotation within search terms.

> Revision: Dec 20, 2021.

## Installation

Npm package: [@spaceavocado/librarian](https://www.npmjs.com/package/@spaceavocado/librarian).

```sh
npm install @spaceavocado/librarian
yarn add @spaceavocado/librarian
```

> The library is being build as **CommonJS** module and **ESM**.

## Basic Usage

An evaluable search expression could be created directly from the evaluable core expression functions or parsed from the raw expression input.

### Raw Expression Parsing

```ts
import { parse } from '@spaceavocado/librarian'

// Parse raw expression into a search function
const search = parse('"cent??" AND ("new york" OR "berlin")').evaluate

// Perform an search
const result1 = search("Christie visited the New York's city center last week.")

// The result1 contains a collection of librarian.Match results
;[
  { match: 'center', term: 'cent??', index: 37, length: 6 },
  { match: 'New York', term: 'new york', index: 21, length: 8 },
]

// Perform an search
const result2 = search(
  "Christie visited the New York's city outskirt last week."
)

// The result2 is false, as there are not found matches
false
```

### Search Expression Operators

```ts
import { term, and, or } from '@spaceavocado/librarian'

// Create the search function from the search expression handlers
const search = and(
  term('cent??'),
  or(term('new york'), term('berlin'))
).evaluate

// Perform an search
const result1 = search("Christie visited the New York's city center last week.")

// The result1 contains a collection of librarian.Match results
;[
  { match: 'center', term: 'cent??', index: 37, length: 6 },
  { match: 'New York', term: 'new york', index: 21, length: 8 },
]

// Perform an search
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

## Boolean Operators

### AND

Requires all terms to be found within the search context.

#### Examples

_Search Context:_

```
The NASA Juno mission, which began orbiting Jupiter in July 2016, just recently made its 38th close flyby of the gas giant. The mission was extended earlier this year, adding on a flyby of Jupiter's moon Ganymede in June.
```

**Search expression 1:** `"nasa" AND "mission" AND "ganymede"`

- _Result_: **Found**, all terms are present in the search context.

**Search expression 2:** `"nasa" AND "august"`

- _Result_: **NOT Found**, "nasa" is present within the search context, but "august" is not.

#### Usage

```ts
import { term, and } from '@spaceavocado/librarian'

const search = and(term('new york'), term('berlin')).evaluate
const search = parse('"new york" AND "berlin"').evaluate

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

- _Result_: **Found**, all terms are present in the search context.

**Search expression 2:** `"nasa" AND "august"`

- _Result_: **Found**, "nasa" is present within the search context, "august" is not, but at least one term is present.

**Search expression 3:** `"spacex" AND "august"`

- _Result_: **NOT Found**, "spacex" nor "august" is present within the search context.

#### Usage

```ts
import { term, or } from '@spaceavocado/librarian'

const search = and(term('new york'), term('berlin')).evaluate
const search = parse('"new york" OR "berlin"').evaluate

const result = search("Christie visited the New York's city center last week.")
```

### NOT

Flips the outcome of other Boolean Operators and/or result of the search term.

#### Examples

_Search Context:_

```
The NASA Juno mission, which began orbiting Jupiter in July 2016, just recently made its 38th close flyby of the gas giant. The mission was extended earlier this year, adding on a flyby of Jupiter's moon Ganymede in June.
```

**Search expression 1:** `NOT "spacex"`

- _Result_: **Found**, "spacex" is NOT present in the search context.

**Search expression 2:** `NOT "nasa"`

- _Result_: **NOT Found**, "nasa" is present in the search context.

**Search expression 3:** `"nasa" AND NOT "spacex"`

- _Result_: **Found**, "nasa" is present, and "spacex" is NOT present in the search context.

**Search expression 3:** `"nasa" AND NOT ("spacex" OR "galactic")`

- _Result_: **Found**, "nasa" is present, and "spacex" or "galactic" are NOT present in the search context.

#### Usage

```ts
import { term, not } from '@spaceavocado/librarian'

const search = not(term('new york')).evaluate
const search = parse('NOT "new york"').evaluate
const search = parse('"new york" AND NOT ("center" AND NOT "week")').evaluate

const result = search("Christie visited the New York's city center last week.")
```

### AND and OR Exclusiveness Within the Same Scope

`AND` and `OR` operators cannot be mixed within the same expression scope, they could be combined only within different scope of the search expression. See [Search Expression Scoping/Nesting](#search-expression-scopingnesting) for more details.

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

const search = term('cent*').evaluate
const search = parse('"cent*"').evaluate

const result = search("Christie visited the New York's city center last week.")
```

### A Question Mark (?)

A question mark (?) may be used to represent a single character, anywhere in the word. It is most useful when there are variable spellings for a word, and you want to search for all variants at once.For example, searching for colo?r would return both color and colour.

**Note:** (?) matches any character (except for line terminators)

**Examples:**

- `cent??` matches: cent**er**, cent**re** but NOT ~cents~
- `???fix` matches: **pre**fix, **suf**fix but NOT ~affix~
- `b??r` matches: b**ee**r, b**ea**r but NOT ~bor~

#### Usage

```ts
import { term } from '@spaceavocado/librarian'

const search = term('cent??').evaluate
const search = parse('"cent??"').evaluate

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

const search = probe(expression).evaluate

// Perform an search with probe data
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
  evaluate: [Function: evaluate],
  result: [
    { term: 'cent??', match: 'center', index: 37, length: 6 },
    { term: 'new york', match: 'New York', index: 21, length: 8 }
  ],
  descendants: [
    {
      id: Symbol(term),
      toString: [Function: toString],
      evaluate: [Function: evaluate],
      result: [
        { term: 'cent??', match: 'center', index: 37, length: 6 }
      ],
      descendants: []
    },
    {
      id: Symbol(or),
      toString: [Function: toString],
      evaluate: [Function: evaluate],
      result: [
        { term: 'new york', match: 'New York', index: 21, length: 8 }
      ],
      descendants: [
        {
          id: Symbol(term),
          toString: [Function: toString],
          evaluate: [Function: evaluate],
          result: [
            { term: 'new york', match: 'New York', index: 21, length: 8 }
          ],
          descendants: []
        },
        {
          id: Symbol(term),
          toString: [Function: toString],
          evaluate: [Function: evaluate],
          descendants: []
        }
      ],
    }
  ]
}
```

- `result: Array` = The expression has been evaluated positively with given captured evaluation results.
- `result: false` = The expression has been evaluated negatively.
- `result: undefined` = The has not been evaluated, i.e this expression branch has not been needed to be evaluated.

---

## Contributing

See [contributing.md](contributing.md).

## License

Librarian is released under the MIT license. See [license.txt](license.txt).
