import { Tokenizer } from './Tokenizer'

describe('tokenizer.Tokenizer', () => {
  const code = `
    def add : Number -> Number -> Number
      x y =>
        if x is 10 then 11 + y else x + y

    console.warn add 6 7
  `

  const tokenizer = Tokenizer.withDefaultParser()

  it('parse a code into a token list', () => {
    console.warn(tokenizer.parse(code))
  })
})
