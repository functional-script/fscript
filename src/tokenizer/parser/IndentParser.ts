import { Token } from '../Token'
import { TokenList } from '../TokenList'
import { TokenParser } from './TokenParser'
import { calculatePosition } from '../Util'
import { TokenError } from '../TokenError'

export class IndentParser implements TokenParser {
  public supports(line: string, tokens: TokenList): boolean {
    return (
      /^ /.test(line) &&
      tokens.length > 0 &&
      tokens[tokens.length - 1].kind === 'NEWLINE'
    )
  }

  public parse(line: string, tokens: TokenList): Token {
    let match = line.match(/^ +/)
    let position = calculatePosition(tokens, match ? match[0] : { length: 0 })

    if (!match) {
      throw new TokenError('INDENT', line, position)
    }

    return {
      kind: 'INDENT',
      value: match[0].length,
      rawValue: match[0],
      position,
    }
  }

  public substract(line: string): string {
    return line.replace(/^ +/, '')
  }
}
