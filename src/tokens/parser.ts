import { TokenParser } from './types'
import { TokenList } from './list'

/**
 * This class allows you to build a token list on top
 * of parsers and input (string or buffer)
 */
export class TokenBuilder {
  private parsers: TokenParser[]

  public constructor(parsers: TokenParser[]) {
    this.parsers = parsers
  }

  /**
   * Parse a given string and return a TokenList
   */
  public parseStr(code: string): TokenList {
    let list = new TokenList([])
    let document = `${code}`

    while (document) {
      for (let parser of this.parsers) {
        if (!parser.supports(document, list)) {
          continue
        }

        list = list.add(parser.parse(document, list))
        document = parser.substract(document, list)

        continue
      }

      throw new RangeError(`Unable to parse the artefact at ${document}`)
    }

    return list
  }
}
