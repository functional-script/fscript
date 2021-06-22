import { TokenBuilder } from './builder'
import { KeywordParser } from './parsers'

describe('A TokenBuilder', () => {
  let builder = TokenBuilder.createDefault()

  it('can parse a simple line of code', () => {
    let code = 'def x : Number = 10'
    let tokens = builder.buildFromString(code)

    expect(tokens.at(1, 0).name).toBe(KeywordParser.ID)
  })

  it('can parse a multiline of code', () => {
    let code = `
      def x : Number = 10

      def add : Number -> Number -> Number
        x y => x + y
    `
    let tokens = builder.buildFromString(code)

    expect(tokens.at(2, 6).name).toBe(KeywordParser.ID)
    expect(tokens.at(4, 6).name).toBe(KeywordParser.ID)
    expect(tokens.at(4, 6).value).toBe('def')
  })

  it('can parse a type or interface declaration', () => {
    let code = `
      type Test = {
        name : String
      }

      interface User {
        email : String
      }
    `

    let tokens = builder.buildFromString(code)

    expect(tokens.at(2, 6).name).toBe(KeywordParser.ID)
    expect(tokens.at(2, 6).value).toBe('type')
    expect(tokens.at(6, 6).name).toBe(KeywordParser.ID)
    expect(tokens.at(6, 6).value).toBe('interface')
  })
})
