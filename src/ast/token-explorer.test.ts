import { TokenExplorer } from './token-explorer'
import {
  KeywordToken,
  SpaceToken,
  IdentifierToken,
  OperatorToken,
  ArrayToken,
  GroupToken,
  TokenBuilder,
} from '../tokens'

describe('A token explorer', () => {
  let code = `def add : Number -> Number -> Number = x y => x + y`
  let explorer = new TokenExplorer(TokenBuilder.build(code))
  let emptyExplorer = new TokenExplorer(
    TokenBuilder.build(`
  
  
         
  

  
  
  
  
  `),
  )

  beforeEach(() => {
    explorer = new TokenExplorer(TokenBuilder.build(code))
  })

  it('contains a cursor with the current token', () => {
    expect(explorer.cursor).toMatchObject({ line: 1, column: 0 })
    expect(explorer.token.name).toBe(KeywordToken.ID)
  })

  it('offers the possibility to navigate into the list ', () => {
    explorer.next()

    expect(explorer.token.name).toBe(SpaceToken.ID)
    expect(explorer.cursor).toMatchObject({ line: 1, column: 3 })

    explorer.next()

    expect(explorer.token.name).toBe(IdentifierToken.ID)
    expect(explorer.cursor).toMatchObject({ line: 1, column: 4 })

    explorer.previous()

    expect(explorer.token.name).toBe(SpaceToken.ID)
    expect(explorer.cursor).toMatchObject({ line: 1, column: 3 })

    explorer.previous()

    expect(explorer.token.name).toBe(KeywordToken.ID)
    expect(explorer.cursor).toMatchObject({ line: 1, column: 0 })
  })

  it('can navigate to the next given token and contains the last token', () => {
    explorer.next([OperatorToken])

    expect(explorer.token.name).toBe(OperatorToken.ID)
    expect(explorer.cursor).toMatchObject({ line: 1, column: 8 })
    expect(explorer.token.value).toBe(':')

    explorer.previous([KeywordToken])

    expect(explorer.token.name).toBe(KeywordToken.ID)
    expect(explorer.token.value).toBe('def')

    expect(explorer.lastToken.name).toBe(OperatorToken.ID)
    expect(explorer.lastToken.value).toBe(':')
  })

  it('can test the existence of previous or next token', () => {
    expect(explorer.hasPrevious()).toBe(false)

    expect(explorer.hasNext()).toBe(true)

    explorer.next([OperatorToken])

    expect(explorer.hasNext()).toBe(true)
    expect(explorer.hasPrevious()).toBe(true)

    explorer.previous([KeywordToken])

    expect(explorer.hasPrevious()).toBe(false)
    expect(explorer.hasNext()).toBe(true)

    expect(explorer.hasNext([ArrayToken])).toBe(false)

    explorer.next([OperatorToken])

    expect(explorer.hasPrevious([GroupToken])).toBe(false)
    expect(explorer.hasPrevious([SpaceToken])).toBe(true)
  })

  it('can detect next and previous token', () => {
    expect(explorer.isNext(SpaceToken)).toBe(true)
    expect(explorer.isNext(IdentifierToken)).toBe(false)

    expect(explorer.isNext(IdentifierToken, [SpaceToken])).toBe(true)

    explorer.next([OperatorToken])

    expect(explorer.isPrevious(SpaceToken)).toBe(true)
    expect(explorer.isPrevious(IdentifierToken)).toBe(false)
    expect(explorer.isPrevious(IdentifierToken, [SpaceToken])).toBe(true)

    expect(explorer.is(OperatorToken)).toBe(true)
  })

  it('can detects if the explorer contains only empty tokens', () => {
    expect(emptyExplorer.isEmpty()).toBe(true)
    expect(explorer.isEmpty()).toBe(false)
  })
})
