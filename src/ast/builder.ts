import { AstNodeBuilder, Node } from './types'
import { TokenExplorer } from '../tokens/token-explorer'
import { NextNodeError, SyntaxError } from './errors'
import { AstExplorer } from './ast-explorer'

export const ROOT_NODE: Node = {
  type: 'ROOT',
  children: [],
}

/**
 * This contains the ability to build an AST
 * on top of a token explorer
 */
export class AstBuilder {
  private builders: AstNodeBuilder[]

  private ast: AstExplorer

  constructor(builders: AstNodeBuilder[] = [], ast?: AstExplorer) {
    this.builders = []

    for (let builder of builders) {
      this.register(builder)
    }

    this.ast = ast ?? new AstExplorer(ROOT_NODE)
  }

  public register(builder: AstNodeBuilder): this {
    if (undefined !== this.builders.find(b => b.name === builder.name)) {
      throw new Error(
        `There is already a builder named ${builder.name} registered inside the AST Builder`,
      )
    }

    this.builders.push(builder)

    return this
  }

  public build(explorer: TokenExplorer, nodes: Node[] = []): Node[] {
    if (explorer.isEmpty()) {
      return nodes
    }

    for (let builder of this.builders) {
      try {
        let node = {
          ...builder.build(explorer, this.ast),
          children: builder
            .next(explorer, this.ast)
            .reduce(
              (root, builder) => root.register(builder),
              new AstBuilder([], this.ast),
            )
            .build(explorer, []),
        }

        return this.build(explorer, [...nodes, node])
      } catch (e) {
        if (e instanceof NextNodeError) {
          continue
        }

        throw e
      }
    }

    return nodes
  }
}
