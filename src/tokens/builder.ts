import { TokenParser } from './types'
import { TokenList } from './list'
import {
  OperatorParser,
  IdentifierParser,
  LiteralParser,
  GroupParser,
  ArrayParser,
  BlockParser,
  NewLineParser,
  IndentParser,
  SpaceParser,
  KeywordParser,
  SeparatorParser,
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
      new NewLineParser(),
      new IndentParser(),
      new SpaceParser(),
      new KeywordParser(),
      new SeparatorParser(),
      new OperatorParser(),
      new IdentifierParser(),
      new LiteralParser(),
      new GroupParser(),
      new ArrayParser(),
      new BlockParser(),
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
