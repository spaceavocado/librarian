import { Match } from './Match';
export declare type EvaluationResult = false | Match[];
export declare type Evaluation = (evaluable: Evaluable, result: EvaluationResult) => void;
export declare type Serializable = Evaluable | string;
export declare type Evaluable = {
    id: symbol;
    kind: string;
    descendants?: Evaluable[];
    toString: (format?: (...arg: Serializable[]) => string) => string;
    evaluate: (context: string, onEvaluation?: Evaluation) => EvaluationResult;
};
