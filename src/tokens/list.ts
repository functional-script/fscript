import { Token } from './types'
import { NewLineParser } from './parsers'

/**
 * Represent a suit of token in wich you can operate
 */
export class TokenList {
  private tokens: Token[]

  get length(): number {
    return this.tokens.length
  }

  get last(): Token | undefined {
    return this.tokens[this.tokens.length - 1]
  }

  get hasLast(): boolean {
    return this.tokens.length > 0
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

  /**
   * Calculate the next position
   */
  calculateNextPostion(subject: { length: number }): Token['position'] {
    return {
      line: this.guessLineNumber(),
      start: this.guessStartColumn(),
      end: this.guessEndColumn(subject),
    }
  }

  /**
   * Return the guessed line number of
   */
  private guessLineNumber(): number {
    let last = this.last

    if (!last) {
      return 1
    }

    if (last.name === NewLineParser.ID) {
      return last.position.line + 1
    }

    return last.position.line
  }

  /**
   * Returned the guessed starting column number
   */
  private guessStartColumn(): number {
    let last = this.last

    if (!last) {
      return 0
    }

    if (last.name === NewLineParser.ID) {
      return 0
    }

    return last.position.end + 1
  }

  /**
   * Returned the guessed last column number
   */
  private guessEndColumn(subject: { length: number }): number {
    return this.guessStartColumn() + (subject.length - 1)
  }
}
