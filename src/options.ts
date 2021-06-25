/**
 * This module defines the options of the fscript compiler
 */
export type CompilerOptions = {
  indentSize: number
  indentKind: 'space' | 'tab'
}

/**
 * This is the default compiler options
 */
export const DEFAULT_COMPILER_OPTIONS: CompilerOptions = {
  indentSize: 2,
  indentKind: 'space',
}
