export const tap =
  <T>(fn: (arg: T) => void) =>
  (arg: T): T => {
    fn(arg)
    return arg
  }
