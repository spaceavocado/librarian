import { Evaluable } from './Evaluable'

export const or = (...operands: Evaluable[]): Evaluable => ({
  toString: () =>
    `(${operands.map((operand) => operand.toString()).join(' OR ')})`,
  evaluate: (context: string) => {
    for (const operand of operands) {
      const evaluated = operand.evaluate(context)
      if (evaluated) {
        return evaluated
      }
    }

    return false
  },
})
