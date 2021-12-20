import { identity, pipe, tap } from '../internal'
import { Evaluable, Evaluation } from './Evaluable'
import { Match } from './Match'

const evaluate =
  (operands: Evaluable[], onEvaluation?: Evaluation) => (context: string) => {
    const matches: Match[] = []
    for (const operand of operands) {
      const evaluated = operand.evaluate(context, onEvaluation)
      if (!evaluated) {
        return false
      }
      matches.push(...evaluated)
    }

    return matches
  }

export const and = (...operands: Evaluable[]): Evaluable =>
  ((id) => ({
    id,
    descendants: operands,
    toString: (format = identity) =>
      `(${operands
        .map(pipe((operand) => operand.toString(), format))
        .join(' AND ')})`,
    evaluate: function (context, onEvaluation) {
      return pipe(
        evaluate(operands, onEvaluation),
        onEvaluation ? tap((result) => onEvaluation(this, result)) : identity
      )(context)
    },
  }))(Symbol('and'))
