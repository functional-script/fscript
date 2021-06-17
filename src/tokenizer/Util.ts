import { TokenList } from './TokenList'
import { Token } from './Token'

/**
 * Calculate the position of a token dependencing of
 * a token list
 */
export const calculatePosition = (
  tokens: TokenList,
  subject: { length: number },
): Token['position'] => ({
  line: getLineNumber(tokens),
  start: getStartColumn(tokens),
  end: getEndColumn(tokens, subject),
})

/**
 * Retrieve the last token ot null
 */
export const getLastToken = (tokens: TokenList): Token | null =>
  tokens.length > 0 ? tokens[tokens.length - 1] : null

/**
 * Test if the token is a new line or not
 */
export const isNewLine = (token: Token | null): boolean =>
  token ? token.kind === 'NEWLINE' : false

/**
 * Retrieve a line number
 */
export const getLineNumber = (tokens: TokenList): number => {
  let lastToken = getLastToken(tokens)

  if (isNewLine(lastToken)) return lastToken ? lastToken.position.line + 1 : 1

  return lastToken ? lastToken.position.line : 1
}

/**
 * Retrieve the start column number
 */
export const getStartColumn = (tokens: TokenList): number => {
  let lastToken = getLastToken(tokens)

  if (isNewLine(lastToken)) return 0

  return lastToken ? lastToken.position.end + 1 : 0
}

/**
 * Retrieve the end column
 */
export const getEndColumn = (
  tokens: TokenList,
  subject: { length: number },
): number => getStartColumn(tokens) + (subject.length - 1)

/**
 * Test if a token exists for the given line and colum
 */
export const hasTokenAt = (
  position: Omit<Token['position'], 'end'>,
  tokens: TokenList,
): boolean =>
  tokens.filter(
    t =>
      t.position.line === position.line && t.position.start === position.start,
  ).length > 0

/**
 * Retrieve the token at the given position
 */
export const getTokenAt = (
  position: Omit<Token['position'], 'end'>,
  tokens: TokenList,
): Token => {
  let token = tokens.find(
    t =>
      t.position.line === position.line && t.position.start === position.start,
  )

  if (!token)
    throw new Error(
      `Unable to find the token at ${position.line}:${position.start}`,
    )

  return token
}
