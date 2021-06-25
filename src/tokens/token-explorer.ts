import { TokenList } from './list'
import { SpaceToken, IndentToken, NewLineToken } from './parsers'
import {
  TokenCursor,
  Token,
  TokenIdentifier,
  SimpleTokenIdentifier,
  DoubleTokenIdentifier,
} from './types'

/**
 * Allows to explore easily an token list with
 * a mutable structure
 */
export class TokenExplorer {
  private _tokens: TokenList

  private _index: number

  private _currentIndentLevel: number

  private _history: { [name: string]: [number, number] }

  /**
   * Returns the entire token list
   */
  public get tokens(): TokenList {
    return this._tokens
  }

  /**
   * Retrieve the current index the explorer
   * is at
   */
  public get index(): number {
    return this._index
  }

  /**
   * Retrieve the current token the explorer is at
   */
  public get token(): Token {
    return this._tokens.get(this._index)
  }

  /**
   * Retrieve the position of the explorer has a cursor
   */
  public get cursor(): TokenCursor {
    return {
      line: this.token.position.line,
      column: this.token.position.start,
      toString: () => {
        return `line: ${this.token.position.line}, column: ${this.token.position.start}`
      },
    }
  }

  /**
   * Retrieve the current identation level
   */
  public get indentLevel(): number {
    return this._currentIndentLevel
  }

  public constructor(tokens: TokenList) {
    this._index = 0
    this._tokens = tokens
    this._currentIndentLevel = 0
    this._history = {}
  }

  /**
   * Test if there is a previous token of the given identifiers
   */
  public hasPrevious(
    tokenIdentifiers: TokenIdentifier[] = [],
    index?: number,
  ): boolean {
    index = index ?? this._index

    if (!this._tokens.hasIndex(index - 1)) {
      return false
    }

    if (0 === tokenIdentifiers.length) {
      return true
    }

    let previousToken = this.tokens.get(index - 1)

    if (this.isTokenInsideIdentifiers(previousToken, tokenIdentifiers)) {
      return true
    }

    return this.hasPrevious(tokenIdentifiers, index - 1)
  }

  /**
   * Test if there is a next token with the given identifiers
   */
  public hasNext(
    tokenIdentifiers: TokenIdentifier[] = [],
    index?: number,
  ): boolean {
    index = index ?? this._index

    if (!this._tokens.hasIndex(index + 1)) {
      return false
    }

    if (0 === tokenIdentifiers.length) {
      return true
    }

    let nextToken = this.tokens.get(index + 1)

    if (this.isTokenInsideIdentifiers(nextToken, tokenIdentifiers)) {
      return true
    }

    return this.hasNext(tokenIdentifiers, index + 1)
  }

  /**
   * Test if the current token is of the given identifier
   */
  public is(identifier: TokenIdentifier): boolean {
    return this.isSameTokenID(this.token.name, identifier)
  }

  /**
   * Test of the given identifier is the next token in
   * the list. You can pass an array of identifiers to
   * exclude of the search
   */
  public isNext(
    id: TokenIdentifier,
    excludedIds: TokenIdentifier[] = [],
    index?: number,
  ): boolean {
    index = index ?? this._index + 1

    if (!this.tokens.hasIndex(index)) {
      return false
    }

    let nextToken = this.tokens.get(index)

    if (this.isTokenInsideIdentifiers(nextToken, excludedIds)) {
      return this.isNext(id, excludedIds, index + 1)
    }

    return this.isSameTokenID(nextToken.name, id)
  }

  /**
   * Test if the given identifier is the previous one in
   * the list. You can pass a list of identifiers to exclude
   */
  public isPrevious(
    id: TokenIdentifier,
    excludedIds: TokenIdentifier[] = [],
    index?: number,
  ): boolean {
    index = index ?? this._index - 1

    if (!this.tokens.hasIndex(index)) {
      return false
    }

    let nextToken = this.tokens.get(index)

    if (this.isTokenInsideIdentifiers(nextToken, excludedIds)) {
      return this.isPrevious(id, excludedIds, index - 1)
    }

    return this.isSameTokenID(nextToken.name, id)
  }

  /**
   * Go to the next token with the given identifier
   */
  public next(tokenIdentifiers: TokenIdentifier[] = []): this {
    if (!this.hasNext(tokenIdentifiers)) {
      throw new RangeError(
        `You have reaching the end of the token list. It is imposible to get the next token`,
      )
    }

    this._index += 1

    if (this.isSameTokenID(this.token.name, IndentToken)) {
      this._currentIndentLevel += 1
    }

    if (this.isSameTokenID(this.token.name, NewLineToken)) {
      this._currentIndentLevel = 0
    }

    if (0 === tokenIdentifiers.length) {
      return this
    }

    if (this.isTokenInsideIdentifiers(this.token, tokenIdentifiers)) {
      return this
    }

    return this.next(tokenIdentifiers)
  }

  /**
   * Go to the previous token with the identifier
   */
  public previous(tokenIdentifiers: TokenIdentifier[] = []): this {
    if (!this.hasPrevious(tokenIdentifiers)) {
      throw new RangeError(
        `You have reaching the start of the token list. It is imposible to get the previous token`,
      )
    }

    this._index -= 1

    if (this.isSameTokenID(this.token.name, IndentToken)) {
      this._currentIndentLevel -= 1
    }

    if (this.isSameTokenID(this.token.name, NewLineToken)) {
      this._currentIndentLevel = 0
    }

    if (0 === tokenIdentifiers.length) {
      return this
    }

    if (this.isTokenInsideIdentifiers(this.token, tokenIdentifiers)) {
      return this
    }

    return this.previous(tokenIdentifiers)
  }

  /**
   * Test if a token name has the same ID has the given
   * identifier
   */
  public isSameTokenID(name: string, identifier: TokenIdentifier): boolean {
    if ((identifier as SimpleTokenIdentifier).ID) {
      return (identifier as SimpleTokenIdentifier).ID === name
    }

    return (
      (identifier as DoubleTokenIdentifier).ID_END === name ||
      (identifier as DoubleTokenIdentifier).ID_START === name
    )
  }

  /**
   * Test if the current explorer at the given position
   * is empty. Meaning that the token list contains only
   * spaces, indents and new lines
   */
  public isEmpty(index?: number): boolean {
    index = index ?? this._index

    if (!this.tokens.hasIndex(index)) {
      return true
    }

    let token = this.tokens.get(index)

    if (
      this.isTokenInsideIdentifiers(token, [
        SpaceToken,
        IndentToken,
        NewLineToken,
      ])
    ) {
      return this.isEmpty(index + 1)
    }

    return false
  }

  /**
   * Test if a Token is inside a given list of identifiers
   */
  public isTokenInsideIdentifiers(
    token: Token,
    identifiers: TokenIdentifier[],
  ): boolean {
    return (
      undefined !== identifiers.find(id => this.isSameTokenID(token.name, id))
    )
  }

  /**
   * Save the current position at the given key in the
   * history
   */
  public save(key: string): this {
    this._history[key] = [this._index, this._currentIndentLevel]

    return this
  }

  /**
   * Load the position of the given history
   */
  public load(key: string): this {
    if (!this._history[key]) {
      throw new RangeError(
        `There is no saved cursor in the token explorer at ${key}`,
      )
    }

    let [index, indent] = this._history[key]

    this._index = index
    this._currentIndentLevel = indent

    return this
  }

  /**
   * Restore the first loaded position and clear the history
   */
  public reset(): this {
    let keys = Object.keys(this._history)

    if (keys.length === 0) {
      return this
    }

    let [index, indent] = this._history[keys[0]]

    this._index = index
    this._currentIndentLevel = indent
    this._history = {}

    return this
  }
}
