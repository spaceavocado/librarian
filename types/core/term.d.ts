import { Evaluable } from './Evaluable';
import { Match } from './Match';
export declare const isAdvancedTerm: (term: string) => boolean;
export declare const advancedTermRx: (term: string) => string;
export declare const plainTerm: (term: string) => (context: string) => false | Match[];
export declare const advancedTerm: (term: string) => (context: string) => false | Match[];
export declare const TERM = "TERM";
/**
 * Supported wildcards:
 *
 * An asterisk (*) may be used to specify any number of characters.
 * It is typically used at the end of a root word, when it is
 * referred to as "truncation." This is great when you want to search
 * for variable endings of a root word.
 * - (*) matches any word character (equivalent to [a-zA-Z0-9_])
 *
 * A question mark (?) may be used to represent a single character,
 * anywhere in the word. It is most useful when there are variable
 * spellings for a word, and you want to search for all variants at once.
 * For example, searching for colo?r would return both color and colour.
 * - (?) matches any character (except for line terminators)
 */
export declare const term: (term: string) => Evaluable;
