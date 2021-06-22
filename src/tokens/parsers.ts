import { TokenParser, Token } from './types'
import { TokenList } from './list'
import { TokenError } from './error'

/**
 * Allows to parse a new line token
 */
export class NewLineParser implements TokenParser {
  get re(): RegExp {
    return /^(\r|\n)/
  }

  static get ID(): string {
    return 'NEW_LINE'
  }

  public supports(code: string): boolean {
    return code.trim() === '' || this.re.test(code)
  }

  public parse(code: string, list: TokenList): Token {
    let lastToken = list.hasLast ? list.last : null

    return {
      name: NewLineParser.ID,
      value: '\n',
      rawValue: '\n',
      position: {
        line: lastToken
          ? lastToken.name === NewLineParser.ID
            ? lastToken.position.line + 1
            : lastToken.position.line
          : 1,
        start: lastToken
          ? lastToken.name === NewLineParser.ID
            ? 0
            : lastToken.position.end + 1
          : 0,
        end: lastToken
          ? lastToken.name === NewLineParser.ID
            ? 0
            : lastToken.position.end + 1
          : 0,
      },
    }
  }

  public substract(code: string, tokens: TokenList): string {
    if (this.re.test(code)) {
      return code.replace(this.re, '')
    }

    return code.trim()
  }
}

/**
 * Allow to parse an indentation
 */
export class IndentParser implements TokenParser {
  static get ID(): string {
    return 'INDENT'
  }

  public supports(code: string, list: TokenList): boolean {
    let lastToken = list.hasLast ? list.last : null

    if (!lastToken) {
      return /^ /.test(code) && list.length === 0
    }

    return /^ /.test(code) && lastToken.name === NewLineParser.ID
  }

  public parse(code: string, list: TokenList): Token {
    let match = code.match(/^ +/)
    let position = list.calculateNextPostion(match ? match[0] : { length: 0 })

    if (!match) {
      throw new TokenError(IndentParser.ID, code, position)
    }

    return {
      name: IndentParser.ID,
      value: match[0].length,
      rawValue: match[0],
      position,
    }
  }

  public substract(code: string): string {
    return code.replace(/^ +/, '')
  }
}

/**
 * Allows to parse spaces
 */
export class SpaceParser implements TokenParser {
  static get ID(): string {
    return 'SPACE'
  }

  public supports(code: string, list: TokenList): boolean {
    return /^ /.test(code)
  }

  public parse(code: string, list: TokenList): Token {
    let match = code.match(/^ +/)
    let position = list.calculateNextPostion(match ? match[0] : { length: 0 })

    if (!match) {
      throw new TokenError(SpaceParser.ID, code, position)
    }

    return {
      name: SpaceParser.ID,
      value: ' ',
      rawValue: match[0],
      position,
    }
  }

  public substract(line: string): string {
    return line.replace(/^ +/, '')
  }
}

/**
 * Parse an fscript keyword
 */
export class KeywordParser implements TokenParser {
  static get ID(): string {
    return 'KEYWORD'
  }

  private re =
    /^(def|var|let|const|class|type|interface|if|else|for|while|do|throw|new|async|await|yield|return|then|import|export|from|as|in|with|function|and|or)/

  public supports(code: string): boolean {
    return this.re.test(code)
  }

  public parse(code: string, list: TokenList): Token {
    let match = code.match(this.re)
    let position = list.calculateNextPostion(match ? match[1] : { length: 0 })

    if (!match) {
      throw new TokenError(KeywordParser.ID, code, position)
    }

    return {
      name: KeywordParser.ID,
      value: match[1],
      rawValue: match[1],
      position,
    }
  }

  public substract(code: string): string {
    return code.replace(this.re, '')
  }
}

/**
 * Parse an fscript separator
 */
export class SeparatorParser implements TokenParser {
  static get ID(): string {
    return 'SEPARATOR'
  }

  private re = /^(,)/

  public supports(code: string): boolean {
    return this.re.test(code)
  }

  public parse(code: string, list: TokenList): Token {
    let match = code.match(this.re)
    let position = list.calculateNextPostion(match ? match[1] : { length: 0 })

    if (!match) {
      throw new TokenError(SeparatorParser.ID, code, position)
    }

    return {
      name: SeparatorParser.ID,
      value: match[1],
      rawValue: match[1],
      position,
    }
  }

  public substract(code: string): string {
    return code.replace(this.re, '')
  }
}

/**
 * Parse any fscript operator
 */
export class OperatorParser implements TokenParser {
  static get ID(): string {
    return 'OPERATOR'
  }

  private re =
    /^(:|=>|\+|\->|\-|\*|\/|\.\.\.|\.\.|\.|=>|<=|===|==|=|is|and|or|not|!=|!==|!|gte|lte|gt|lt|eq)/

  public supports(code: string): boolean {
    return this.re.test(code)
  }

  public parse(code: string, list: TokenList): Token {
    let match = code.match(this.re)
    let position = list.calculateNextPostion(match ? match[1] : { length: 0 })

    if (!match) {
      throw new TokenError(OperatorParser.ID, code, position)
    }

    return {
      name: OperatorParser.ID,
      value: match[1],
      rawValue: match[1],
      position,
    }
  }

  public substract(code: string): string {
    return code.replace(this.re, '')
  }
}

/**
 * Parse an fscript identifier
 */
export class IdentifierParser implements TokenParser {
  static get ID(): string {
    return 'IDENTIFIER'
  }

  private re = /^([a-zA-Z][a-zA-Z0-9_-]*)/

  public supports(code: string): boolean {
    return this.re.test(code)
  }

  public parse(code: string, list: TokenList): Token {
    let match = code.match(this.re)
    let position = list.calculateNextPostion(match ? match[1] : { length: 0 })

    if (!match) {
      throw new TokenError(IdentifierParser.ID, code, position)
    }

    return {
      name: IdentifierParser.ID,
      value: match[1],
      rawValue: match[1],
      position,
    }
  }

  public substract(code: string): string {
    return code.replace(this.re, '')
  }
}

/**
 * Parse an fscript literral
 */
export class LiteralParser implements TokenParser {
  static get ID(): string {
    return 'LITTERAL'
  }

  private re =
    /^(([0-9.]+)|("[^"]*")|('[^']*')|(`[^`]*`)|(true|false|null|void|undefined))/

  public supports(code: string): boolean {
    return this.re.test(code)
  }

  public parse(code: string, list: TokenList): Token {
    let match = code.match(this.re)
    let position = list.calculateNextPostion(match ? match[1] : { length: 0 })

    if (!match) {
      throw new TokenError(LiteralParser.ID, code, position)
    }

    return {
      name: LiteralParser.ID,
      value: match[1],
      rawValue: match[1],
      position,
    }
  }

  public substract(code: string): string {
    return code.replace(this.re, '')
  }
}

/**
 * Parse an fscript group using parenthesis
 */
export class GroupParser implements TokenParser {
  static get ID_START(): string {
    return 'GROUP_START'
  }

  static get ID_END(): string {
    return 'GROUP_END'
  }

  private re = /^(\)|\()/

  public supports(code: string): boolean {
    return this.re.test(code)
  }

  public parse(code: string, list: TokenList): Token {
    let match = code.match(this.re)
    let position = list.calculateNextPostion(match ? match[1] : { length: 0 })

    if (!match) {
      throw new TokenError(
        `${GroupParser.ID_START}|${GroupParser.ID_END}`,
        code,
        position,
      )
    }

    return {
      name: match[1] === ')' ? GroupParser.ID_END : GroupParser.ID_START,
      value: match[1],
      rawValue: match[1],
      position,
    }
  }

  public substract(code: string): string {
    return code.replace(this.re, '')
  }
}

/**
 * Parse instruction block or objet group definitions
 * "{}"
 */
export class BlockParser implements TokenParser {
  static get ID_START(): string {
    return 'BLOCK_START'
  }

  static get ID_END(): string {
    return 'BLOCK_END'
  }

  private re = /^(\}|\{)/

  public supports(code: string): boolean {
    return this.re.test(code)
  }

  public parse(code: string, list: TokenList): Token {
    let match = code.match(this.re)
    let position = list.calculateNextPostion(match ? match[1] : { length: 0 })

    if (!match) {
      throw new TokenError(
        `${BlockParser.ID_START}|${BlockParser.ID_END}`,
        code,
        position,
      )
    }

    return {
      name: match[1] === '}' ? BlockParser.ID_END : BlockParser.ID_START,
      value: match[1],
      rawValue: match[1],
      position,
    }
  }

  public substract(code: string): string {
    return code.replace(this.re, '')
  }
}

/**
 * Parse array bracket syntax "[]"
 */
export class ArrayParser implements TokenParser {
  static get ID_START(): string {
    return 'ARRAY_START'
  }

  static get ID_END(): string {
    return 'ARRAY_END'
  }

  private re = /^(\]|\[)/

  public supports(code: string): boolean {
    return this.re.test(code)
  }

  public parse(code: string, list: TokenList): Token {
    let match = code.match(this.re)
    let position = list.calculateNextPostion(match ? match[1] : { length: 0 })

    if (!match) {
      throw new TokenError(
        `${ArrayParser.ID_START}|${ArrayParser.ID_END}`,
        code,
        position,
      )
    }

    return {
      name: match[1] === ']' ? ArrayParser.ID_END : ArrayParser.ID_START,
      value: match[1],
      rawValue: match[1],
      position,
    }
  }

  public substract(code: string): string {
    return code.replace(this.re, '')
  }
}
