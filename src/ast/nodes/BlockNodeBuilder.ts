import { AstNodeBuilder, Node } from '../types'
import { TokenExplorer } from '../explorer'
import { AssignementNodeBuilder } from './AssignementNodeBuilder'

/**
 * Build a block node in the AST
 */
export class BlockNodeBuilder implements AstNodeBuilder {
  public get name(): string {
    return 'BLOCK'
  }

  public build(explorer: TokenExplorer): Node {
    return { type: this.name }
  }

  public next(explorer: TokenExplorer): AstNodeBuilder[] {
    return [new AssignementNodeBuilder()]
  }
}
