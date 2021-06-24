import { AstNodeBuilder, Node } from '../types'
import { TokenExplorer } from '../token-explorer'
import {
  OperatorToken,
  SpaceToken,
  NewLineToken,
  IndentToken,
} from '../../tokens/parsers'

export const TYPING_ASSIGNEMENT_OPERATOR = ':'

export const TYPING_OPERATORS = ['->', '~>', '...', '.']

export type TypingOperators =
  | typeof TYPING_ASSIGNEMENT_OPERATOR
  | typeof TYPING_OPERATORS[number]

/**
 * Build a typing node
 */
export class TypingNodeBuilder implements AstNodeBuilder {
  public get name(): string {
    return 'TYPING'
  }

  public build(explorer: TokenExplorer): Node {
    // Check if we find a typing assignement operator
    if (
      !explorer.isNext(OperatorToken, [SpaceToken, NewLineToken, IndentToken])
    ) {
      throw new SyntaxError(
        'No typing assignement operator are present into the identifier',
      )
    }

    explorer.next([OperatorToken])

    if (explorer.token.value !== TYPING_ASSIGNEMENT_OPERATOR) {
      throw new SyntaxError(
        'No typing assignement operator are present into the identifier',
      )
    }

    return { type: this.name }
  }

  public next(explorer: TokenExplorer): AstNodeBuilder[] {
    return []
  }
}
