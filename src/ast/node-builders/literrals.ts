import { Node, AstNodeBuilder } from '../types'
import { AstExplorer } from '../ast-explorer'
import { TokenExplorer } from '../../tokens/token-explorer'
import { KEYWORD_BOOLEAN, KeywordBoolean } from '../../tokens/types'
import {
  LiteralToken,
  SpaceToken,
  IndentToken,
  NewLineToken,
} from '../../tokens/parsers'
import { SyntaxError } from '../errors'

/**
 * Represent the node of a number lireral
 */
export type NumberLiteralNode = Node & {
  value: number
  kind: 'integer' | 'float'
}

/**
 * Represent the node of a boolean literal
 */
export type BooleanLiteralNode = Node & {
  value: boolean
}

/**
 * Represent the node of a string literal
 */
export type StringLiteralNode = Node & {
  value: string
}

/**
 * This class build a number literal
 */
class NumberLiteralBuilder implements AstNodeBuilder {
  public readonly name = 'LITERAL_NUMBER'

  supports(explorer: TokenExplorer, ast: AstExplorer): boolean {
    if (explorer.is(LiteralToken)) {
      return this.isNumber(explorer.token.value)
    }

    if (
      !explorer.isNext(LiteralToken, [SpaceToken, NewLineToken, IndentToken])
    ) {
      return false
    }

    explorer.next([LiteralToken])

    return this.isNumber(explorer.token.value)
  }

  build(explorer: TokenExplorer, ast: AstExplorer): NumberLiteralNode {
    return {
      type: this.name,
      value: this.isFloat(explorer.token.value)
        ? parseFloat(explorer.token.value as string)
        : parseInt(explorer.token.value as string),
      kind: this.isFloat(explorer.token.value) ? 'float' : 'integer',
    }
  }

  next(explorer: TokenExplorer, ast: AstExplorer): AstNodeBuilder[] {
    explorer.next()

    return []
  }

  private isNumber(value: string | number): boolean {
    return /^[0-9.]+/.test(`${value}`)
  }

  private isFloat(value: string | number): boolean {
    return /^\d*\.\d+/.test(`${value}`)
  }
}

/**
 * This build a boolean literal
 */
class BooleanLiteralBuilder implements AstNodeBuilder {
  public readonly name = 'LITERAL_BOOLEAN'

  supports(explorer: TokenExplorer, ast: AstExplorer): boolean {
    if (explorer.is(LiteralToken)) {
      return this.isBoolean(explorer.token.value)
    }

    if (
      !explorer.isNext(LiteralToken, [SpaceToken, NewLineToken, IndentToken])
    ) {
      return false
    }

    explorer.next([LiteralToken])

    return this.isBoolean(explorer.token.value)
  }

  build(explorer: TokenExplorer, ast: AstExplorer): BooleanLiteralNode {
    return {
      type: this.name,
      value: this.getBoolean(explorer.token.value as KeywordBoolean),
    }
  }

  next(explorer: TokenExplorer, ast: AstExplorer): AstNodeBuilder[] {
    explorer.next()

    return []
  }

  private isBoolean(value: string | number): boolean {
    return KEYWORD_BOOLEAN.includes(`${value}`)
  }

  private getBoolean(value: KeywordBoolean): boolean {
    return 'true' === value || 'yes' === value ? true : false
  }
}

/**
 * This build a single line string literal
 */
class StringLiteralBuilder implements AstNodeBuilder {
  public readonly name = 'LITERAL_STRING'

  supports(explorer: TokenExplorer, ast: AstExplorer): boolean {
    if (explorer.is(LiteralToken)) {
      return this.isString(explorer.token.value)
    }

    if (
      !explorer.isNext(LiteralToken, [SpaceToken, NewLineToken, IndentToken])
    ) {
      return false
    }

    explorer.next([LiteralToken])

    return this.isString(explorer.token.value)
  }

  build(explorer: TokenExplorer, ast: AstExplorer): StringLiteralNode {
    return {
      type: this.name,
      value: (explorer.token.value as string)
        .replace(/^"/, '')
        .replace(/^'/, '')
        .replace(/'$/, '')
        .replace(/"$/, ''),
    }
  }

  next(explorer: TokenExplorer, ast: AstExplorer): AstNodeBuilder[] {
    explorer.next()

    return []
  }

  private isString(value: string | number): boolean {
    return /^("[^"]*")|('[^']*')/.test(`${value}`)
  }
}

/**
 * This is the generic literal builder that aggregates
 * the literal together
 */
export class LiteralNodeBuilder implements AstNodeBuilder {
  private builders: AstNodeBuilder[]

  private selectedBuilder: AstNodeBuilder | undefined

  public readonly name: string = 'LITERAL'

  constructor() {
    this.builders = [
      new NumberLiteralBuilder(),
      new BooleanLiteralBuilder(),
      new StringLiteralBuilder(),
    ]
  }

  supports(explorer: TokenExplorer, ast: AstExplorer): boolean {
    this.selectedBuilder = this.builders.find(builder =>
      builder.supports(explorer, ast),
    )

    return undefined !== this.selectedBuilder
  }

  build(explorer: TokenExplorer, ast: AstExplorer): Node {
    if (undefined === this.selectedBuilder) {
      throw new SyntaxError(explorer.cursor, 'Unable to parse this literal')
    }

    return this.selectedBuilder.build(explorer, ast)
  }

  next(explorer: TokenExplorer, ast: AstExplorer): AstNodeBuilder[] {
    if (undefined === this.selectedBuilder) {
      throw new SyntaxError(explorer.cursor, 'Unable to parse this literal')
    }

    return this.selectedBuilder.next(explorer, ast)
  }
}
