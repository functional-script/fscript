/**
 * This type represent all the available kind's
 * of a token
 */
export type TokenKind =
  | 'KEYWORD'
  | 'INDENT'
  | 'SPACE'
  | 'OPERATOR'
  | 'IDENTIFIER'
  | 'SEPARATOR'
  | 'LITTERAL'
  | 'NEWLINE'
  | 'GROUP_START'
  | 'GROUP_END'
  | 'BLOCK_START'
  | 'BLOCK_END'
  | 'ARRAY_START'
  | 'ARRAY_END'
  | 'UNKNOWN'
