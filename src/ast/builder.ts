import { AstNodeBuilder, Node } from './types'
import { TokenExplorer } from '../tokens/token-explorer'

/**
 * This contains the ability to build an AST
 * on top of a token explorer
 */
export class AstBuilder {
  private builders: AstNodeBuilder[]

  constructor(builders: AstNodeBuilder[] = []) {
    this.builders = []

    for (let builder of builders) {
      this.register(builder)
    }
  }

  public has(name: string): boolean {
    return this.builders.map(builder => builder.name).includes(name)
  }

  public get(name: string): AstNodeBuilder {
    let builder = this.builders.find(builder => builder.name)

    if (!builder) throw new RangeError(`Undefined AST node builder ${name}`)

    return builder
  }

  public find(names: string[]): AstNodeBuilder[] {
    if (0 === names.length) {
      return this.builders
    }

    let builders: AstNodeBuilder[] = []

    for (let name of names) {
      this.builders.push(this.get(name))
    }

    return builders
  }

  public register(builder: AstNodeBuilder): this {
    if (this.has(builder.name)) {
      throw new RangeError(
        `The builder ${builder.name} has already been registered`,
      )
    }

    this.builders.push(builder)

    return this
  }

  public build(explorer: TokenExplorer, nodes: Node[] = []): Node[] {
    let lastError: Error | null = null

    if (explorer.isEmpty()) {
      return nodes
    }

    for (let builder of this.builders) {
      try {
        let node = {
          ...builder.build(explorer),
          children: builder
            .next(explorer)
            .reduce((root, builder) => root.register(builder), new AstBuilder())
            .build(explorer, []),
        }

        return this.build(explorer, [...nodes, node])
      } catch (e) {
        lastError = e

        continue
      }
    }

    if (lastError && nodes.length === 0) {
      throw lastError
    }

    return nodes
  }
}
