import { Evaluable } from './Evaluable';
export declare const OR = "OR";
export declare const or: (exhaustive?: boolean) => (...operands: Evaluable[]) => Evaluable;
