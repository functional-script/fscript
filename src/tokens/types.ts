import { TokenList } from './list'

/**
 * Represent the shape of a Token
 */
export type Token = {
  name: string
  value: string | number
  rawValue: string | number
  position: {
    line: number
    start: number
    end: number
  }
}

/**
 * This is the shape of a token parser
 */
export type TokenParser = {
  /**
   * Test if the given parser supports the given subject
   */
  supports(subject: string, tokens: TokenList): boolean

  /**
   * Parse the token and return a token
   */
  parse(subject: string, tokens: TokenList): Token

  /**
   * Remove the token from the given subject
   */
  substract(subject: string, tokens: TokenList): string
}
