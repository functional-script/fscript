import { TokenParser, Token } from './types'
import { TokenList } from './list'
import { TokenError } from './error'
import { CompilerOptions } from '../options'

/**
 * Allows to parse a new line token
 */
export class NewLineToken implements TokenParser {
  constructor(options: CompilerOptions) {}

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
      name: NewLineToken.ID,
      value: '\n',
      rawValue: '\n',
      position: {
        line: lastToken
          ? lastToken.name === NewLineToken.ID
            ? lastToken.position.line + 1
            : lastToken.position.line
          : 1,
        start: lastToken
          ? lastToken.name === NewLineToken.ID
            ? 0
            : lastToken.position.end + 1
          : 0,
        end: lastToken
          ? lastToken.name === NewLineToken.ID
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
export class IndentToken implements TokenParser {
  private kind: CompilerOptions['indentKind']
  private size: CompilerOptions['indentSize']

  constructor(options: CompilerOptions) {
    this.kind = options.indentKind
    this.size = options.indentSize
  }

  static get ID(): string {
    return 'INDENT'
  }

  public supports(code: string, list: TokenList): boolean {
    let re =
      this.kind === 'space'
        ? new RegExp(`^${' '.repeat(this.size)}`)
        : new RegExp('^\t')
    let lastToken = list.hasLast ? list.last : null

    if (!lastToken) {
      return re.test(code) && list.length === 0
    }

    return (
      re.test(code) &&
      (lastToken.name === NewLineToken.ID || lastToken.name === IndentToken.ID)
    )
  }

  public parse(code: string, list: TokenList): Token {
    let re =
      this.kind === 'space'
        ? new RegExp(`^${' '.repeat(this.size)}`)
        : new RegExp('^\t')

    let match = code.match(re)
    let position = list.calculateNextPostion(match ? match[0] : { length: 0 })

    if (!match) {
      throw new TokenError(IndentToken.ID, code, position)
    }

    return {
      name: IndentToken.ID,
      value: match[0].length,
      rawValue: match[0],
      position,
    }
  }

  public substract(code: string): string {
    let re =
      this.kind === 'space'
        ? new RegExp(`^${' '.repeat(this.size)}`)
        : new RegExp('^\t')

    return code.replace(re, '')
  }
}

/**
 * Allows to parse spaces
 */
export class SpaceToken implements TokenParser {
  constructor(options: CompilerOptions) {}

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
      throw new TokenError(SpaceToken.ID, code, position)
    }

    return {
      name: SpaceToken.ID,
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
export class KeywordToken implements TokenParser {
  constructor(options: CompilerOptions) {}

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
      throw new TokenError(KeywordToken.ID, code, position)
    }

    return {
      name: KeywordToken.ID,
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
export class SeparatorToken implements TokenParser {
  constructor(options: CompilerOptions) {}

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
      throw new TokenError(SeparatorToken.ID, code, position)
    }

    return {
      name: SeparatorToken.ID,
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
export class OperatorToken implements TokenParser {
  constructor(options: CompilerOptions) {}

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
      throw new TokenError(OperatorToken.ID, code, position)
    }

    return {
      name: OperatorToken.ID,
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
export class IdentifierToken implements TokenParser {
  constructor(options: CompilerOptions) {}

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
      throw new TokenError(IdentifierToken.ID, code, position)
    }

    return {
      name: IdentifierToken.ID,
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
export class LiteralToken implements TokenParser {
  constructor(options: CompilerOptions) {}

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
      throw new TokenError(LiteralToken.ID, code, position)
    }

    return {
      name: LiteralToken.ID,
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
export class GroupToken implements TokenParser {
  constructor(options: CompilerOptions) {}

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
        `${GroupToken.ID_START}|${GroupToken.ID_END}`,
        code,
        position,
      )
    }

    return {
      name: match[1] === ')' ? GroupToken.ID_END : GroupToken.ID_START,
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
export class BlockToken implements TokenParser {
  constructor(options: CompilerOptions) {}

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
        `${BlockToken.ID_START}|${BlockToken.ID_END}`,
        code,
        position,
      )
    }

    return {
      name: match[1] === '}' ? BlockToken.ID_END : BlockToken.ID_START,
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
export class ArrayToken implements TokenParser {
  constructor(options: CompilerOptions) {}

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
        `${ArrayToken.ID_START}|${ArrayToken.ID_END}`,
        code,
        position,
      )
    }

    return {
      name: match[1] === ']' ? ArrayToken.ID_END : ArrayToken.ID_START,
      value: match[1],
      rawValue: match[1],
      position,
    }
  }

  public substract(code: string): string {
    return code.replace(this.re, '')
  }
}
