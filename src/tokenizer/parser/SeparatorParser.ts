import { Token } from '../Token'
import { TokenList } from '../TokenList'
import { TokenParser } from './TokenParser'
import { calculatePosition } from '../Util'
import { TokenError } from '../TokenError'

export class SeparatorParser implements TokenParser {
  private re = /^(,)/

  public supports(line: string): boolean {
    return this.re.test(line)
  }

  public parse(line: string, tokens: TokenList): Token {
    let match = line.match(this.re)
    let position = calculatePosition(tokens, match ? match[1] : { length: 0 })

    if (!match) {
      throw new TokenError('SEPARATOR', line, position)
    }

    return {
      kind: 'SEPARATOR',
      value: match[1],
      rawValue: match[1],
      position,
    }
  }

  public substract(line: string): string {
    return line.replace(this.re, '')
  }
}
