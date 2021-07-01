import { AstBuilder } from '../builder'
import {
  BooleanLiteralNode,
  LiteralNodeBuilder,
  NumberLiteralNode,
} from '../node-builders/literrals'
import { AstExplorer } from '../ast-explorer'
import { TokenExplorer } from '../../tokens/token-explorer'
import { TokenBuilder } from '../../tokens/builder'
import { ROOT_NODE } from '../types'
import { StringLiteralNode } from '../node-builders/literrals'

describe('A token builder', () => {
  let builder: AstBuilder
  let code: string = `
10
10.56
.46
true
false
yes
    no
'Hello World'
" Hello World 2 "
  `
  let ast: AstExplorer

  beforeAll(() => {
    builder = new AstBuilder([new LiteralNodeBuilder()])

    let nodes = builder.build(new TokenExplorer(TokenBuilder.build(code)))

    ast = new AstExplorer({ ...ROOT_NODE, children: nodes })
  })

  it('can parse literal nodes', () => {
    expect(ast.node.children?.length).toBe(9)
  })

  it('can parse integer literal', () => {
    let firstNumber = ast.node.children?.[0] as NumberLiteralNode
    let secondNumber = ast.node.children?.[1] as NumberLiteralNode
    let thirdNumber = ast.node.children?.[2] as NumberLiteralNode

    expect(firstNumber.type).toBe('LITERAL_NUMBER')
    expect(secondNumber.type).toBe('LITERAL_NUMBER')
    expect(thirdNumber.type).toBe('LITERAL_NUMBER')
    expect(firstNumber.value).toBe(10)
    expect(secondNumber.value).toBe(10.56)
    expect(thirdNumber.value).toBe(0.46)
    expect(firstNumber.kind).toBe('integer')
    expect(secondNumber.kind).toBe('float')
    expect(thirdNumber.kind).toBe('float')
  })

  it('can parse boolean literal', () => {
    let firstBool = ast.node.children?.[3] as BooleanLiteralNode
    let secondBool = ast.node.children?.[4] as BooleanLiteralNode
    let thirdBool = ast.node.children?.[5] as BooleanLiteralNode
    let fourthBool = ast.node.children?.[6] as BooleanLiteralNode

    expect(firstBool.type).toBe('LITERAL_BOOLEAN')
    expect(secondBool.type).toBe('LITERAL_BOOLEAN')
    expect(thirdBool.type).toBe('LITERAL_BOOLEAN')
    expect(fourthBool.type).toBe('LITERAL_BOOLEAN')
    expect(firstBool.value).toBe(true)
    expect(secondBool.value).toBe(false)
    expect(thirdBool.value).toBe(true)
    expect(fourthBool.value).toBe(false)
  })

  it('can parse string literal', () => {
    let firstString = ast.node.children?.[7] as StringLiteralNode
    let secondString = ast.node.children?.[8] as StringLiteralNode

    expect(firstString.type).toBe('LITERAL_STRING')
    expect(secondString.type).toBe('LITERAL_STRING')
    expect(firstString.value).toBe('Hello World')
    expect(secondString.value).toBe(' Hello World 2 ')
  })
})
