import { AstNodeBuilder, Node, ROOT_NODE } from './types'
import { TokenExplorer } from '../tokens/token-explorer'
import { AstExplorer } from './ast-explorer'

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
    this.builders.push(builder)

    return this
  }

  public build(explorer: TokenExplorer, nodes: Node[] = []): Node[] {
    if (explorer.isEmpty() || 0 === this.builders.length) {
      return nodes
    }

    for (let builder of this.builders) {
      if (!builder.supports(explorer, this.ast)) {
        continue
      }

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
    }

    return nodes
  }
}
