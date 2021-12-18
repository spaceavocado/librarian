import { Evaluable } from './Evaluable'
import { Match } from './Match'

export const and = (...operands: Evaluable[]): Evaluable => ({
  toString: () =>
    `(${operands.map((operand) => operand.toString()).join(' AND ')})`,
  evaluate: (context: string) => {
    const matches: Match[] = []
    for (const operand of operands) {
      const evaluated = operand.evaluate(context)
      if (!evaluated) {
        return false
      }
      matches.push(...evaluated)
    }

    return matches
  },
})
