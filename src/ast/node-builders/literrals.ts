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

export type NumberLiteralNode = Node & {
  value: number
  kind: 'integer' | 'float'
}

export type BooleanLiteralNode = Node & {
  value: boolean
}

/**
 * This class build a number literal
 */
export class NumberLiteralBuilder implements AstNodeBuilder {
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
    return []
  }

  private isNumber(value: string | number): boolean {
    return /^\d+/.test(`${value}`)
  }

  private isFloat(value: string | number): boolean {
    return /^\d*\.\d+/.test(`${value}`)
  }
}

/**
 * This build a boolean literal
 */
export class BooleanLiteralBuilder implements AstNodeBuilder {
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
    return []
  }

  private isBoolean(value: string | number): boolean {
    return KEYWORD_BOOLEAN.includes(`${value}`)
  }

  private getBoolean(value: KeywordBoolean): boolean {
    return 'true' === value || 'yes' === value ? true : false
  }
}
