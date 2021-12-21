import { Evaluable, EvaluationResult } from './Evaluable';
export declare type ProbeResult = Omit<Evaluable, 'descendants'> & {
    result: EvaluationResult | undefined;
    descendants?: ProbeResult[];
};
export declare const combine: (evaluable: Evaluable, evaluationMap: Record<symbol, EvaluationResult>) => ProbeResult;
export declare const probe: (evaluable: Evaluable) => {
    evaluate: (context: string) => [EvaluationResult, ProbeResult];
    id: symbol;
    kind: string;
    descendants?: Evaluable[] | undefined;
    toString: (format?: ((...arg: import("./Evaluable").Serializable[]) => string) | undefined) => string;
};
