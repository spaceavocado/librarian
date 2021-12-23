import { identity, pipe, tap } from '../internal'
import { Evaluable, Evaluation } from './Evaluable'

const execute =
  (operands: Evaluable[], onEvaluation?: Evaluation) => (context: string) => {
    for (const operand of operands) {
      const evaluated = operand.execute(context, onEvaluation)
      if (evaluated !== false) {
        return false
      }
    }

    return true
  }

export const NOR = 'NOR'

export const nor = (...operands: Evaluable[]): Evaluable => {
  if (operands.length < 2) {
    throw new Error('logical NOR expression must have at least 2 operands')
  }

  return {
    id: Symbol(NOR),
    kind: NOR,
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
        `(${operands.map((operand) => operand.toString()).join(' NOR ')})`
    ) => format(...operands),
  }
}
