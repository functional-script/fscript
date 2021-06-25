import { Token } from './types'

/**
 * Represent an error during any token parsing operation
 */
export class TokenError extends Error {
  public subject: string

  public position: Token['position']

  constructor(name: string, subject: string, position: Token['position']) {
    let message = `Error(Token): Unable to parse the ${name} token at ${position.line}:${position.start} in "${subject}"`

    super(message)

    this.name = 'FScript(TokenError)'
    this.message = message
    this.subject = subject
    this.position = position

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
