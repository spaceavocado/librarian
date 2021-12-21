import { identity, pipe, tap } from '../internal'
import { Evaluable, Evaluation } from './Evaluable'

const evaluate =
  (operands: Evaluable[], onEvaluation?: Evaluation) => (context: string) => {
    for (const operand of operands) {
      const evaluated = operand.evaluate(context, onEvaluation)
      if (evaluated) {
        return evaluated
      }
    }

    return false
  }

export const OR = 'OR'

export const or = (...operands: Evaluable[]): Evaluable =>
  ((id) => ({
    id,
    kind: OR,
    descendants: operands,
    toString: (
      format = (...operands) =>
        `(${operands.map((operand) => operand.toString()).join(' OR ')})`
    ) => format(...operands),
    evaluate: function (context, onEvaluation) {
      return pipe(
        evaluate(operands, onEvaluation),
        onEvaluation ? tap((result) => onEvaluation(this, result)) : identity
      )(context)
    },
  }))(Symbol(OR))
