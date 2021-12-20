import { Match } from './Match'

export type EvaluationResult = false | Match[]

export type Evaluation = (
  evaluable: Evaluable,
  result: EvaluationResult
) => void

export type Evaluable = {
  id: symbol
  descendants?: Evaluable[]
  toString: (format?: (operand: string) => string) => string
  evaluate: (context: string, onEvaluation?: Evaluation) => EvaluationResult
}
