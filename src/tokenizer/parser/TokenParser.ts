import { Token } from '../Token'
import { TokenList } from '../TokenList'

/**
 * Define the ability to parse a given token
 */
export interface TokenParser {
  /**
   * Test if the line contains the token to parse
   */
  supports(line: string, tokens: TokenList): boolean

  /**
   * Parse the token and return a Token
   */
  parse(line: string, tokens: TokenList): Token

  /**
   * Remove the token from the given string
   */
  substract(line: string, tokens: TokenList): string
}
