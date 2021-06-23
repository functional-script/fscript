import { TokenParser } from './types'
import { TokenList } from './list'
import {
  OperatorToken,
  IdentifierToken,
  LiteralToken,
  GroupToken,
  ArrayToken,
  BlockToken,
  NewLineToken,
  IndentToken,
  SpaceToken,
  KeywordToken,
  SeparatorToken,
} from './parsers'

/**
 * This class allows you to build a token list on top
 * of parsers and input (string or buffer)
 */
export class TokenBuilder {
  private parsers: TokenParser[]

  /**
   * Create a token builder on top of default parsers
   */
  public static createDefault(): TokenBuilder {
    return new TokenBuilder([
      new NewLineToken(),
      new IndentToken(),
      new SpaceToken(),
      new KeywordToken(),
      new SeparatorToken(),
      new OperatorToken(),
      new IdentifierToken(),
      new LiteralToken(),
      new GroupToken(),
      new ArrayToken(),
      new BlockToken(),
    ])
  }

  public constructor(parsers: TokenParser[]) {
    this.parsers = parsers
  }

  /**
   * Parse a given string and return a TokenList
   */
  public buildFromString(code: string, tokens?: TokenList): TokenList {
    let list = tokens ? tokens : new TokenList([])

    if (code.length === 0) {
      return list
    }

    for (let parser of this.parsers) {
      if (!parser.supports(code, list)) {
        continue
      }

      return this.buildFromString(
        parser.substract(code, list),
        list.add(parser.parse(code, list)),
      )
    }

    throw new RangeError(`Unable to parse the artefact at ${document}`)
  }

  /**
   * Register a new parser
   */
  public addParser(parser: TokenParser): this {
    this.parsers.push(parser)

    return this
  }
}
