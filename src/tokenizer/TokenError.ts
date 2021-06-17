import { Token } from './Token'
import { TokenKind } from './TokenKind'

/**
 * Represent an error during any token parsing operation
 */
export class TokenError extends Error {
  public subject: string

  public position: Token['position']

  constructor(kind: TokenKind, subject: string, position: Token['position']) {
    let message = `Error(Token): Unable to parse the ${kind} token at ${position.line}:${position.start} in "${subject}"`

    super(message)

    this.name = 'TokenError'
    this.message = message
    this.subject = subject
    this.position = position

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
