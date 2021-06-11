import { TokenKind } from './TokenKind'

/**
 * Define the shape of a token
 */
export type Token = {
  kind: TokenKind
  value: string | number
  rawValue: string | number
  position: {
    line: number
    start: number
    end: number
  }
}
