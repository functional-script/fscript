import { TokenList } from './list'
import { CompilerOptions } from '../options'

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
 * Represent a cursor inside a token list
 */
export type TokenCursor = {
  line: number
  column: number
  toString: () => string
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

/**
 * Define the shape of a token identifier
 */
export type SimpleTokenIdentifier = {
  ID: string
}

export type DoubleTokenIdentifier = {
  ID_START: string
  ID_END: string
}

export type TokenIdentifier = SimpleTokenIdentifier | DoubleTokenIdentifier
