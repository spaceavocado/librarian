import { Match } from './Match';
export declare type EvaluationResult = false | Match[];
export declare type Evaluation = (evaluable: Evaluable, result: EvaluationResult) => void;
export declare type Evaluable = {
    id: symbol;
    descendants?: Evaluable[];
    toString: (format?: (operand: string) => string) => string;
    evaluate: (context: string, onEvaluation?: Evaluation) => EvaluationResult;
};
