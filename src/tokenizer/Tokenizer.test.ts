import { Tokenizer } from './Tokenizer'
import { getTokenAt } from './Util'

describe('tokenizer.Tokenizer', () => {
  const code1 = `def name : String = "john"`
  const code2 = `
import { test } from my-library
  `

  const tokenizer = Tokenizer.withDefaultParser()

  it('parse a code into a token list', () => {
    let tokens = tokenizer.parse(code1)

    let defToken = getTokenAt({ line: 1, start: 0 }, tokens)
    let stringToken = getTokenAt({ line: 1, start: 11 }, tokens)
    let johnToken = getTokenAt({ line: 1, start: 20 }, tokens)

    expect(defToken.kind).toBe('KEYWORD')
    expect(defToken.value).toBe('def')
    expect(stringToken.kind).toBe('IDENTIFIER')
    expect(stringToken.value).toBe('String')
    expect(johnToken.kind).toBe('LITTERAL')
    expect(johnToken.value).toBe('"john"')

    console.warn(tokenizer.parse(code2))
  })
})
