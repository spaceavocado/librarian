import { Match } from './Match'

export type EvaluationResult = boolean | Match[]

export type Evaluation = (
  evaluable: Evaluable,
  result: EvaluationResult
) => void

export type Serializable = Evaluable | string

export type Evaluable = {
  id: symbol
  kind: string
  descendants?: Evaluable[]
  toString: (format?: (...arg: Serializable[]) => string) => string
  test: (context: string) => boolean
  execute: (context: string, onEvaluation?: Evaluation) => EvaluationResult
}
