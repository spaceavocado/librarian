import { Evaluable } from './Evaluable'

export const not = (operand: Evaluable): Evaluable => ({
  toString: () => `NOT ${operand.toString()}`,
  evaluate: (context: string) =>
    ((evaluated) => (evaluated === false ? [] : false))(
      operand.evaluate(context)
    ),
})
