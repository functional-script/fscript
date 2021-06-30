import { TokenExplorer } from '../tokens/token-explorer'
import { AstExplorer } from './ast-explorer'

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

  supports(explorer: TokenExplorer, ast: AstExplorer): boolean

  build(explorer: TokenExplorer, ast: AstExplorer): Node

  next(explorer: TokenExplorer, ast: AstExplorer): AstNodeBuilder[]
}

/**
 * This is the shape of a ROOT_NODE into an AST
 */
export const ROOT_NODE: Node = {
  type: 'ROOT',
  children: [],
}
