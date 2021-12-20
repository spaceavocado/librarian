import { identity, pipe, tap } from '../internal'
import { Evaluable } from './Evaluable'

export const not = (operand: Evaluable): Evaluable =>
  ((id) => ({
    id,
    descendants: [operand],
    toString: (format = identity) => `NOT ${format(operand.toString())}`,
    evaluate: function (context, onEvaluation) {
      return pipe(
        (evaluated) => (evaluated === false ? [] : false),
        onEvaluation ? tap((result) => onEvaluation(this, result)) : identity
      )(operand.evaluate(context, onEvaluation))
    },
  }))(Symbol('not'))
