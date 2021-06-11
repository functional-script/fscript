import { Token } from '../Token'
import { TokenList } from '../TokenList'
import { TokenParser } from './TokenParser'

export class NewLineParser implements TokenParser {
  public supports(line: string): boolean {
    return line.trim() === ''
  }

  public parse(line: string, tokens: TokenList): Token {
    let lastToken = tokens.length > 0 ? tokens[tokens.length - 1] : null

    return {
      kind: 'NEWLINE',
      value: '\n',
      rawValue: '\n',
      position: {
        line: lastToken
          ? lastToken.kind === 'NEWLINE'
            ? lastToken.position.line + 1
            : lastToken.position.line
          : 1,
        start: lastToken
          ? lastToken.kind === 'NEWLINE'
            ? 0
            : lastToken.position.end + 1
          : 0,
        end: lastToken
          ? lastToken.kind === 'NEWLINE'
            ? 0
            : lastToken.position.end + 1
          : 0,
      },
    }
  }

  public substract(line: string, tokens: TokenList): string {
    return line.trim()
  }
}
