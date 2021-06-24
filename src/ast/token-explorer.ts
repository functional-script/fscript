import { TokenList } from '../tokens/list'
import { SpaceToken, IndentToken, NewLineToken } from '../tokens/parsers'
import {
  TokenCursor,
  Token,
  TokenIdentifier,
  SimpleTokenIdentifier,
  DoubleTokenIdentifier,
} from '../tokens/types'

/**
 * Allows to explore easily an token list with
 * a mutable structure
 */
export class TokenExplorer {
  private _tokens: TokenList

  private _previousIndex: number | null

  private _index: number

  public get tokens(): TokenList {
    return this._tokens
  }

  public get index(): number {
    return this._index
  }

  public get lastToken(): Token {
    if (!this._previousIndex) {
      throw new RangeError(`No previous tokens has been yet defined`)
    }

    return this._tokens.get(this._previousIndex)
  }

  public get token(): Token {
    return this._tokens.get(this._index)
  }

  public get cursor(): TokenCursor {
    return {
      line: this.token.position.line,
      column: this.token.position.start,
      toString: () => {
        return `line: ${this.token.position.line}, column: ${this.token.position.start}`
      },
    }
  }

  public constructor(tokens: TokenList) {
    this._index = 0
    this._previousIndex = null
    this._tokens = tokens
  }

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

  public is(identifier: TokenIdentifier): boolean {
    return this.isSameTokenID(this.token.name, identifier)
  }

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

  public next(
    tokenIdentifiers: TokenIdentifier[] = [],
    registerIndex: boolean = true,
  ): this {
    if (!this.hasNext(tokenIdentifiers)) {
      throw new RangeError(
        `You have reaching the end of the token list. It is imposible to get the next token`,
      )
    }

    if (registerIndex) {
      this._previousIndex = this._index
    }

    this._index += 1

    if (0 === tokenIdentifiers.length) {
      return this
    }

    if (this.isTokenInsideIdentifiers(this.token, tokenIdentifiers)) {
      return this
    }

    return this.next(tokenIdentifiers, false)
  }

  public previous(
    tokenIdentifiers: TokenIdentifier[] = [],
    registerIndex: boolean = true,
  ): this {
    if (!this.hasPrevious(tokenIdentifiers)) {
      throw new RangeError(
        `You have reaching the start of the token list. It is imposible to get the previous token`,
      )
    }

    if (registerIndex) {
      this._previousIndex = this._index
    }

    this._index -= 1

    if (0 === tokenIdentifiers.length) {
      return this
    }

    if (this.isTokenInsideIdentifiers(this.token, tokenIdentifiers)) {
      return this
    }

    return this.previous(tokenIdentifiers, false)
  }

  public isSameTokenID(name: string, identifier: TokenIdentifier): boolean {
    if ((identifier as SimpleTokenIdentifier).ID) {
      return (identifier as SimpleTokenIdentifier).ID === name
    }

    return (
      (identifier as DoubleTokenIdentifier).ID_END === name ||
      (identifier as DoubleTokenIdentifier).ID_START === name
    )
  }

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

  public isTokenInsideIdentifiers(
    token: Token,
    identifiers: TokenIdentifier[],
  ): boolean {
    return (
      undefined !== identifiers.find(id => this.isSameTokenID(token.name, id))
    )
  }
}
