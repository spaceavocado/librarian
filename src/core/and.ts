import { identity, pipe, tap } from '../internal'
import { Evaluable, Evaluation } from './Evaluable'
import { Match } from './Match'

const execute =
  (operands: Evaluable[], onEvaluation?: Evaluation) => (context: string) => {
    const matches: Match[] = []
    for (const operand of operands) {
      const evaluated = operand.execute(context, onEvaluation)
      if (!evaluated) {
        return false
      }
      matches.push(...evaluated)
    }

    return matches
  }

export const AND = 'AND'

export const and = (...operands: Evaluable[]): Evaluable =>
  ((id) => ({
    id,
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
  }))(Symbol(AND))
