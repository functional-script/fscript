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

/**
 * This error is used in order to skip a part of
 * the node builder and pass to the next node builder
 */
export class NextNodeError extends Error {
  constructor(explenation?: string) {
    let message = explenation
      ? `FSCript(NextNodeError): ${explenation}`
      : 'FScript(NextNodeError)'

    super(message)

    this.name = 'FScript(NextNodeError)'
    this.message = message

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
