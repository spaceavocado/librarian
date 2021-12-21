import { Match } from './Match'

export type EvaluationResult = false | Match[]

export type Evaluation = (
  evaluable: Evaluable,
  result: EvaluationResult
) => void

export type Serializable = {
  toString: () => string
}

export type Evaluable = {
  id: symbol
  kind: string
  descendants?: Evaluable[]
  toString: (format?: (...arg: Serializable[]) => string) => string
  evaluate: (context: string, onEvaluation?: Evaluation) => EvaluationResult
}
