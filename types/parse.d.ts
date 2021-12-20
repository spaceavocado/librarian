import { Evaluable } from './core';
export declare const readOperatorBuffer: (buffer: string | null, char: string) => string | null;
export declare const setExclusiveOperator: (exclusive: boolean) => (previous: string | undefined, pending: string) => string | undefined;
declare type Combine = (operands: Evaluable[]) => Evaluable;
export declare const reduceOperands: (combine: Combine) => (operands: Evaluable[]) => Evaluable;
export declare const parse: (input: string) => Evaluable;
export {};
