import { Token } from './types'

/**
 * Represent a suit of token in wich you can operate
 */
export class TokenList {
  private tokens: Token[]

  get length(): number {
    return this.tokens.length
  }

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  /**
   * Add a new token at the end of the list
   */
  public add(token: Token): TokenList {
    return new TokenList([...this.tokens, token])
  }

  /**
   * Execute a function on each token in the list
   */
  each(fn: (token: Token) => any): TokenList {
    this.tokens.forEach(fn)

    return this
  }

  /**
   * Find a token that match the given predicate
   */
  find(predicate: (token: Token) => boolean): Token {
    const element = this.tokens.find(predicate)

    if (!element)
      throw new RangeError(
        `Unable to find any tokens that match the given predicate`,
      )

    return element
  }

  /**
   * Filter the tokens
   */
  filter(fn: (token: Token) => boolean): TokenList {
    let tokens = this.tokens.filter(fn)

    return new TokenList(tokens)
  }

  /**
   * Retrieve the token at the given position
   */
  at(line: number, start: number): Token {
    const token = this.tokens.find(
      token =>
        token.position.line === line &&
        token.position.start <= start &&
        token.position.end >= start,
    )

    if (!token)
      throw new RangeError(`Unable to find any token at line ${line}:${start}`)

    return token
  }

  /**
   * Remove the token at the given position
   */
  remove(line: number, start: number): TokenList {
    const index = this.tokens.findIndex(
      token =>
        token.position.line === line &&
        token.position.start <= start &&
        token.position.end >= start,
    )

    if (-1 === index)
      throw new RangeError(
        `Unable to remove any token at line ${line}:${start}`,
      )

    return new TokenList(
      this.tokens.filter(
        token =>
          token.position.line === line &&
          token.position.start <= start &&
          token.position.end >= start,
      ),
    )
  }

  /**
   * Test the existence of a token at the given position
   */
  has(line: number, start: number): boolean {
    const token = this.tokens.find(
      token =>
        token.position.line === line &&
        token.position.start <= start &&
        token.position.end >= start,
    )

    return token ? true : false
  }

  /**
   * Creates an array on top of this token list
   */
  map<Data>(fn: (token: Token) => Data): Data[] {
    return this.tokens.map(fn)
  }

  /**
   * Transform this list of token into an other data type
   */
  reduce<Data>(fn: (acc: Data, token: Token) => Data, acc: Data): Data {
    return this.tokens.reduce(fn, acc)
  }
}
