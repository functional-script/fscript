import { Token } from '../Token'
import { TokenList } from '../TokenList'
import { TokenParser } from './TokenParser'
import { calculatePosition } from '../Util'
import { TokenError } from '../TokenError'

export class SpaceParser implements TokenParser {
  public supports(line: string, tokens: TokenList): boolean {
    return /^ /.test(line)
  }

  public parse(line: string, tokens: TokenList): Token {
    let match = line.match(/^ +/)
    let position = calculatePosition(tokens, match ? match[0] : { length: 0 })

    if (!match) {
      throw new TokenError('SPACE', line, position)
    }

    return {
      kind: 'SPACE',
      value: ' ',
      rawValue: match[0],
      position,
    }
  }

  public substract(line: string): string {
    return line.replace(/^ +/, '')
  }
}
