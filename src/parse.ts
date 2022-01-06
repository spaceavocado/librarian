import { and, Evaluable, nor, not, or, term, xor } from './core'
import { identity } from './internal'

const TERM_START = '"'
const TERM_END = '"'
const SCOPE_START = '('
const SCOPE_END = ')'
const ESCAPE_CHAR = '\\'
const AND_OPERATOR = 'AND'
const OR_OPERATOR = 'OR'
const NOR_OPERATOR = 'NOR'
const XOR_OPERATOR = 'XOR'
const NOT_OPERATOR = 'NOT'

export const readOperatorBuffer = (
  buffer: string | null,
  char: string
): string | null =>
  // Only [A-Z] are considered operator characters
  ((code) => (code >= 65 && code <= 90 ? (buffer ?? '') + char : buffer))(
    char.charCodeAt(0)
  )

export const setExclusiveOperator =
  (exclusive: boolean) =>
  (previous: string | undefined, pending: string): string | undefined => {
    if (!exclusive) {
      return previous
    }
    if (previous && previous !== pending) {
      throw new Error(
        'logical operators (AND, OR, XOR, NOR) cannot be combined within the same scope'
      )
    }
    return pending
  }

type Combine = (operands: Evaluable[]) => Evaluable
type Add = (operand: Evaluable) => Evaluable
type Operator = {
  combine: (combine: Combine) => Combine
  add: (add: Add) => Add
  exclusive: boolean
}

export const reduceOperands =
  (combine: Combine) =>
  (operands: Evaluable[]): Evaluable =>
    ((operands) => (operands.length > 1 ? combine(operands) : operands[0]))(
      operands.filter(identity)
    )

export type ParseOptions = {
  /**
   * logical OR expression will evaluate all evaluable regardless possible short-circuiting.
   * This may be handle to find/highlight all matches. The applies only on the execute function
   * not on the test function.
   */
  exhaustiveOr: boolean
}

const defaultOptions: ParseOptions = {
  exhaustiveOr: false,
}

export const parse = (
  input: string,
  options: Partial<ParseOptions> = defaultOptions
): Evaluable =>
  ((options) => {
    const operators: Record<string, Operator> = {
      [AND_OPERATOR]: {
        combine: () => (operands) =>
          reduceOperands((operands) => and(...operands))(operands),
        add: identity,
        exclusive: true,
      },
      [OR_OPERATOR]: {
        combine: () => (operands) =>
          reduceOperands((operands) => or(options.exhaustiveOr)(...operands))(
            operands
          ),
        add: identity,
        exclusive: true,
      },
      [NOR_OPERATOR]: {
        combine: () => (operands) =>
          reduceOperands((operands) => nor(...operands))(operands),
        add: identity,
        exclusive: true,
      },
      [XOR_OPERATOR]: {
        combine: () => (operands) =>
          reduceOperands((operands) => xor(...operands))(operands),
        add: identity,
        exclusive: true,
      },
      [NOT_OPERATOR]: {
        combine: identity,
        add: () => (operand) => not(operand),
        exclusive: false,
      },
    }

    const scope = (input: string): [Evaluable, number] => {
      const operands: Evaluable[] = []
      let combine: Combine = (operands) => operands[0]
      let add: Add = identity
      let termBuffer: string | null = null
      let operatorBuffer: string | null = null
      let exclusiveOperator: string | undefined

      const addOperand = (operand: Evaluable) => {
        operands.push(add(operand))
        add = identity
      }

      let position = 0
      for (; position < input.length; position++) {
        const char = input[position]
        if (
          char === TERM_END &&
          termBuffer !== null &&
          input[position - 1] !== ESCAPE_CHAR
        ) {
          addOperand(term(termBuffer))
          termBuffer = null
          continue
        }

        if (char === TERM_START && termBuffer === null) {
          termBuffer = ''
          continue
        }
        if (termBuffer !== null) {
          termBuffer += char
          continue
        }

        operatorBuffer = readOperatorBuffer(operatorBuffer, char)

        if (operatorBuffer && operators[operatorBuffer]) {
          exclusiveOperator = setExclusiveOperator(
            operators[operatorBuffer].exclusive
          )(exclusiveOperator, operatorBuffer)

          combine = operators[operatorBuffer].combine(combine)
          add = operators[operatorBuffer].add(add)
          operatorBuffer = null
          continue
        }

        if (char === SCOPE_START) {
          const [inner, endsAt] = scope(input.substring(position + 1))
          addOperand(inner)
          position += endsAt
        }
        if (char === SCOPE_END) {
          position++
          break
        }
      }

      return [combine(operands), position]
    }

    input = input.trim()
    // unscoped plain term, e.g: "term", auto-scoped, i.e.: "\"term\""
    input = /^["(][")]$|^[^\s][")]$|^["(][^\s]$/.test(
      input[0] + input[input.length - 1]
    )
      ? input
      : TERM_START + input + TERM_END

    const parsed = scope(input)[0]
    if (!parsed) {
      throw new Error(`invalid syntax: ${input}`)
    }

    return parsed
  })(Object.assign(defaultOptions, options))
