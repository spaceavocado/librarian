import { identity, pipe, tap } from '../internal'
import { Evaluable, Evaluation } from './Evaluable'
import { Match } from './Match'

const execute =
  (operands: Evaluable[], exhaustive: boolean, onEvaluation?: Evaluation) =>
  (context: string) => {
    const matches: Match[] = []
    let result = false
    for (const operand of operands) {
      const evaluated = operand.execute(context, onEvaluation)
      if (evaluated) {
        result = true
        if (Array.isArray(evaluated)) {
          matches.push(...evaluated)
        }
        if (!exhaustive) {
          return evaluated
        }
      }
    }

    return matches.length ? matches : result
  }

export const OR = 'OR'

export const or =
  (exhaustive = false) =>
  (...operands: Evaluable[]): Evaluable => {
    if (operands.length < 2) {
      throw new Error('logical OR expression must have at least 2 operands')
    }

    return {
      id: Symbol(OR),
      kind: OR,
      descendants: operands,
      execute: function (context, onEvaluation) {
        return pipe(
          execute(operands, exhaustive, onEvaluation),
          onEvaluation ? tap((result) => onEvaluation(this, result)) : identity
        )(context)
      },
      test: function (context) {
        return execute(operands, false)(context) !== false
      },
      toString: (
        format = (...operands) =>
          `(${operands.map((operand) => operand.toString()).join(' OR ')})`
      ) => format(...operands),
    }
  }
