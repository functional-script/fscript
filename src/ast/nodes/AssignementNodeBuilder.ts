import { AstNodeBuilder, Node } from '../types'
import { TokenExplorer } from '../explorer'
import {
  IdentifierToken,
  KeywordToken,
  NewLineToken,
  SpaceToken,
  IndentToken,
} from '../../tokens/parsers'

export const ASSIGNEMENT_KEYWORDS = ['def', 'let', 'const', 'var']

export type AssignementKeyword = typeof ASSIGNEMENT_KEYWORDS[number]

export type AssignementNode = Node & {
  keyword: AssignementKeyword
  identifier: string
}

/**
 * Build an assignement block
 */
export class AssignementNodeBuilder implements AstNodeBuilder {
  public get name(): string {
    return 'ASSIGNEMENT'
  }

  public build(explorer: TokenExplorer): AssignementNode {
    let keyword: any = null
    let identifier: any = null

    if (!explorer.is(KeywordToken)) {
      if (
        !explorer.isNext(KeywordToken, [NewLineToken, SpaceToken, IndentToken])
      ) {
        throw new SyntaxError(`Unable to find a keyword at ${explorer.cursor}`)
      }

      explorer.next([KeywordToken])
    }

    if (!ASSIGNEMENT_KEYWORDS.includes(explorer.token.name)) {
      throw new SyntaxError(
        `You have a syntax error at ${explorer.cursor}:
        
        The keyword « ${
          explorer.token.value
        } » is not a valid assignement keyword :/
        
        Maybe you mean one of this keyword ? ${ASSIGNEMENT_KEYWORDS.join(
          ', ',
        )}`,
      )
    }

    keyword = explorer.token.value

    if (!explorer.isNext(IdentifierToken, [SpaceToken])) {
      throw new SyntaxError(
        `Unable to find an identifier attached to the definition at ${explorer.cursor}`,
      )
    }

    explorer.next([IdentifierToken])

    identifier = explorer.token.value

    return { type: this.name, keyword, identifier }
  }

  public next(explorer: TokenExplorer): AstNodeBuilder[] {
    return []
  }
}
