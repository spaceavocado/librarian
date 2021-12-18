import { Match } from './Match';
export declare type Evaluable = {
    toString: () => string;
    evaluate: (context: string) => false | Match[];
};
