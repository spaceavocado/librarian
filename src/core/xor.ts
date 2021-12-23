import { identity, pipe, tap } from '../internal'
import { Evaluable, Evaluation } from './Evaluable'
import { Match } from './Match'

const combine = (a: boolean, b: boolean): boolean => (a || b) && !(a && b)

const execute =
  (operands: Evaluable[], onEvaluation?: Evaluation) => (context: string) => {
    let matches: Match[] = []

    let result
    for (const operand of operands) {
      const evaluated = operand.execute(context, onEvaluation)
      result = combine(result ?? false, evaluated !== false)
      if (evaluated !== false) {
        matches = evaluated
      }
    }

    return result ? matches : false
  }

export const XOR = 'XOR'

export const xor = (...operands: Evaluable[]): Evaluable => {
  if (operands.length < 2) {
    throw new Error('logical XOR expression must have at least 2 operands')
  }

  return {
    id: Symbol(XOR),
    kind: XOR,
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
        `(${operands.map((operand) => operand.toString()).join(' XOR ')})`
    ) => format(...operands),
  }
}
