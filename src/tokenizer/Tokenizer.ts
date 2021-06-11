import { TokenList } from './TokenList'
import { TokenParser } from './parser/TokenParser'
import { NewLineParser } from './parser/NewLineParser'
import { IndentParser } from './parser/IndentParser'
import { SpaceParser } from './parser/SpaceParser'
import { KeywordParser } from './parser/KeywordParser'
import { OperatorParser } from './parser/OperatorParser'
import { SeparatorParser } from './parser/SeparatorParser'
import { IdentifierParser } from './parser/IdentifierParser'
import { LiteralParser } from './parser/LiteralParser'
import { GroupParser } from './parser/GroupParser'
import { ArrayParser } from './parser/ArrayParser'
import { BlockParser } from './parser/BlockParser'

/**
 * Allow to parse a given string and transform
 * that string into a list of Token
 */
export class Tokenizer {
  private parsers: TokenParser[]

  public static withDefaultParser(): Tokenizer {
    return new Tokenizer([
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

  constructor(parsers: TokenParser[] = []) {
    this.parsers = parsers
  }

  /**
   * Parse a given string and return a TokenList
   */
  public parse(rawString: string): TokenList {
    let lines = rawString.split('\n')
    let tokens: TokenList = []

    for (let line of lines) {
      tokens = this.parseLine(line, tokens)
    }

    return tokens
  }

  private parseLine(line: string, tokens: TokenList = []): TokenList {
    for (let parser of this.parsers) {
      if (!parser.supports(line, tokens)) {
        continue
      }

      let token = parser.parse(line, tokens)
      let newLine = parser.substract(line, tokens)

      return token.kind === 'NEWLINE'
        ? [...tokens, token]
        : this.parseLine(newLine, [...tokens, token])
    }

    return tokens
  }
}
