import { identity, pipe, tap } from '../internal'
import { Evaluable } from './Evaluable'

export const NOT = 'NOT'

export const not = (operand: Evaluable): Evaluable => ({
  id: Symbol(NOT),
  kind: NOT,
  descendants: [operand],
  execute: function (context, onEvaluation) {
    return pipe(
      (evaluated) => !evaluated,
      onEvaluation ? tap((result) => onEvaluation(this, result)) : identity
    )(operand.execute(context, onEvaluation))
  },
  test: function (context) {
    return this.execute(context) !== false
  },
  toString: (format = (operand) => `NOT ${operand.toString()}`) =>
    format(operand),
})
