import { Match } from './Match'

export type Evaluable = {
  toString: () => string
  evaluate: (context: string) => false | Match[]
}
