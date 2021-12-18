export const replace =
  (pattern: string | RegExp, replacement: string) => (context: string) =>
    context.replace(pattern, replacement)
