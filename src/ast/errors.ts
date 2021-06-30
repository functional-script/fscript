import { TokenCursor } from '../tokens/types'

/**
 * Define a syntax error
 */
export class SyntaxError extends Error {
  public cursor: TokenCursor

  constructor(cursor: TokenCursor, explenation: string = '') {
    let message = `FScript Syntax Error at ${cursor}`

    if (explenation) {
      message += `\n\n${explenation}`
    }

    super(message)

    this.name = 'FScript(SyntaxError)'
    this.message = message
    this.cursor = cursor

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
