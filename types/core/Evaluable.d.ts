import { Match } from './Match';
export declare type EvaluationResult = boolean | Match[];
export declare type Evaluation = (evaluable: Evaluable, result: EvaluationResult) => void;
export declare type Serializable = Evaluable | string;
export declare type Evaluable = {
    id: symbol;
    kind: string;
    descendants?: Evaluable[];
    toString: (format?: (...arg: Serializable[]) => string) => string;
    test: (context: string) => boolean;
    execute: (context: string, onEvaluation?: Evaluation) => EvaluationResult;
};
