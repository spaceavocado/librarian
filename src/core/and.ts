import { identity, isBoolean, pipe, tap } from '../internal'
import { Evaluable, Evaluation } from './Evaluable'
import { Match } from './Match'

const execute =
  (operands: Evaluable[], onEvaluation?: Evaluation) => (context: string) => {
    const matches: Match[] = []
    for (const operand of operands) {
      const evaluated = operand.execute(context, onEvaluation)
      if (!isBoolean(evaluated)) {
        matches.push(...evaluated)
      }
      if (!evaluated) {
        return false
      }
    }

    return matches.length ? matches : true
  }

export const AND = 'AND'

export const and = (...operands: Evaluable[]): Evaluable => {
  if (operands.length < 2) {
    throw new Error('logical AND expression must have at least 2 operands')
  }

  return {
    id: Symbol(AND),
    kind: AND,
    descendants: operands,
    execute: function (context, onEvaluation) {
      return pipe(
        execute(operands, onEvaluation),
        onEvaluation ? tap((result) => onEvaluation(this, result)) : identity
      )(context)
    },
    test: function (context) {
      return this.execute(context) !== false
    },
    toString: (
      format = (...operands) =>
        `(${operands.map((operand) => operand.toString()).join(' AND ')})`
    ) => format(...operands),
  }
}
