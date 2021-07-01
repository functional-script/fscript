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

/*
 * The following section contains all token types in
 * the language
 */

// KEYWORDS :

export const KEYWORD_BOOLEAN = ['true', 'false', 'yes', 'no']
export type KeywordBoolean = typeof KEYWORD_BOOLEAN[number]

export const KEYWORD_VOIDISH = ['null', 'undefined', 'void', 'nothing']
export type KeywordVoidish = typeof KEYWORD_VOIDISH[number]

export const KEYWORD_LITERAL = [...KEYWORD_BOOLEAN, ...KEYWORD_VOIDISH]
export type KeywordLiteral = typeof KEYWORD_LITERAL[number]

export const KEYWORD = [...KEYWORD_LITERAL]
export type Keyword = typeof KEYWORD[number]
