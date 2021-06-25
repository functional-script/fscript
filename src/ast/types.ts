import { TokenExplorer } from '../tokens/token-explorer'

/**
 * Define the shape of an AST leaf
 */
export type Node = {
  type: string
  children?: Array<Node>
}

/**
 * Define the shape an an Node builder
 */
export type AstNodeBuilder = {
  readonly name: string

  build(explorer: TokenExplorer): Node

  next(explorer: TokenExplorer): AstNodeBuilder[]
}
