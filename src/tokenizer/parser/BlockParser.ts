import { Token } from '../Token'
import { TokenList } from '../TokenList'
import { TokenParser } from './TokenParser'
import { calculatePosition } from '../Util'
import { TokenError } from '../TokenError'

/**
 * Parse instruction block or objet group definitions
 * "{}"
 */
export class BlockParser implements TokenParser {
  private re = /^(\}|\{)/

  public supports(line: string): boolean {
    return this.re.test(line)
  }

  public parse(line: string, tokens: TokenList): Token {
    let match = line.match(this.re)
    let position = calculatePosition(tokens, match ? match[1] : { length: 0 })

    if (!match) {
      throw new TokenError('BLOCK_START', line, position)
    }

    return {
      kind: match[1] === '}' ? 'BLOCK_END' : 'BLOCK_START',
      value: match[1],
      rawValue: match[1],
      position,
    }
  }

  public substract(line: string): string {
    return line.replace(this.re, '')
  }
}
