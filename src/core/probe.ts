import { Evaluable, EvaluationResult } from './Evaluable'

export type ProbeResult = Omit<Evaluable, 'descendants'> & {
  result: EvaluationResult | undefined
  descendants?: ProbeResult[]
}

export const combine = (
  evaluable: Evaluable,
  evaluationMap: Record<symbol, EvaluationResult>
): ProbeResult => ({
  ...evaluable,
  result: evaluationMap[evaluable.id],
  descendants: (evaluable.descendants ?? []).map((evaluable) =>
    combine(evaluable, evaluationMap)
  ),
})

export const probe = (evaluable: Evaluable) => ({
  ...evaluable,
  evaluate: (context: string): [EvaluationResult, ProbeResult] => {
    const evaluationMap: Record<symbol, EvaluationResult> = {}
    const result = evaluable.evaluate(context, (evaluable, result) => {
      evaluationMap[evaluable.id] = result
    })
    console.log(evaluationMap)
    return [result, combine(evaluable, evaluationMap)]
  },
})
