import { Evaluable } from './core';
export declare const readOperatorBuffer: (buffer: string | null, char: string) => string | null;
export declare const setExclusiveOperator: (exclusive: boolean) => (previous: string | undefined, pending: string) => string | undefined;
declare type Combine = (operands: Evaluable[]) => Evaluable;
export declare const reduceOperands: (combine: Combine) => (operands: Evaluable[]) => Evaluable;
export declare type ParseOptions = {
    /**
     * logical OR expression will evaluate all evaluable regardless possible short-circuiting.
     * This may be handle to find/highlight all matches. The applies only on the execute function
     * not on the test function.
     */
    exhaustiveOr: boolean;
};
export declare const parse: (input: string, options?: Partial<ParseOptions>) => Evaluable;
export {};
