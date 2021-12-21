import { identity, pipe, tap } from '../internal'
import { Evaluable } from './Evaluable'

export const NOT = 'NOT'

export const not = (operand: Evaluable): Evaluable =>
  ((id) => ({
    id,
    kind: NOT,
    descendants: [operand],
    toString: (format = (operand) => `NOT ${operand.toString()}`) =>
      format(operand),
    evaluate: function (context, onEvaluation) {
      return pipe(
        (evaluated) => (evaluated === false ? [] : false),
        onEvaluation ? tap((result) => onEvaluation(this, result)) : identity
      )(operand.evaluate(context, onEvaluation))
    },
  }))(Symbol(NOT))
