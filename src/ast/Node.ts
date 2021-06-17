import { Token } from '../tokenizer/Token'
import { TokenKind } from '../tokenizer/TokenKind'
import { KeywordParser } from '../tokenizer/parser/KeywordParser'

let test = `
  def add : Number -> Number -> Number
    user => console.warn user
`

/**
 * Define all the kind of nodes possible into
 * a funscript AST
 */
export type NodeKind =
  | 'BLOCK'
  | 'ASSIGNEMENT'
  | 'TYPE_ASSIGNEMENT'
  | 'TYPE'
  | 'TYPE_GROUP'
  | 'TYPE_GENERIC_GROUP'
  | 'FUNCTION'
  | 'FUNCTION_ARGUMENT'
  | 'OPERATION'
  | 'CALL'
  | 'CALL_ARGUMENT'
  | 'CALL_ARGUMENT_SEPARATOR'
  | 'MEMBER_ASSSIGNEMENT'
  | 'STRING_LITERAL'
  | 'OBJECT_ACCESSOR'

/**
 * This is the shape of an AST node
 */
export type Node = {
  kind: NodeKind
  children: Array<Node | Leaf>
}

export type AssignementKeyword = 'def' | 'let' | 'const' | 'var'

export type AssignementNode = Node & {
  keyword: AssignementKeyword
}

export const createAssignement = (
  keyword: AssignementKeyword,
): AssignementNode => ({ kind: 'ASSIGNEMENT', keyword, children: [] })

export type OperatorKeyword = '+' | '-' | '/' | '*'

export type OperatorNode = Node & {
  operation: OperatorKeyword
}

export const createOperator = (operation: OperatorKeyword): OperatorNode => ({
  kind: 'OPERATION',
  operation,
  children: [],
})

let s = createAssignement('def')

s.children.push(createOperator('+'))

export type Leaf = Token
