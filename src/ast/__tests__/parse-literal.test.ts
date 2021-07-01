import { AstBuilder } from '../builder'
import {
  BooleanLiteralNode,
  LiteralNodeBuilder,
  NullishLiteralNode,
  NumberLiteralNode,
} from '../node-builders/literrals'
import { AstExplorer } from '../ast-explorer'
import { TokenExplorer } from '../../tokens/token-explorer'
import { TokenBuilder } from '../../tokens/builder'
import { ROOT_NODE } from '../types'
import {
  BooleanLiteralBuilder,
  NumberLiteralBuilder,
  StringLiteralBuilder,
} from '../node-builders/literrals'
import {
  StringLiteralNode,
  NullishLiteralBuilder,
} from '../node-builders/literrals'

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
undefined
void
null
nothing
  `
  let ast: AstExplorer

  beforeAll(() => {
    builder = new AstBuilder([new LiteralNodeBuilder()])

    let nodes = builder.build(new TokenExplorer(TokenBuilder.build(code)))

    ast = new AstExplorer({ ...ROOT_NODE, children: nodes })
  })

  it('can parse literal nodes', () => {
    expect(ast.node.children?.length).toBe(13)
  })

  it('can parse integer literal', () => {
    let firstNumber = ast.node.children?.[0] as NumberLiteralNode
    let secondNumber = ast.node.children?.[1] as NumberLiteralNode
    let thirdNumber = ast.node.children?.[2] as NumberLiteralNode

    expect(firstNumber.type).toBe(NumberLiteralBuilder.NAME)
    expect(secondNumber.type).toBe(NumberLiteralBuilder.NAME)
    expect(thirdNumber.type).toBe(NumberLiteralBuilder.NAME)
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

    expect(firstBool.type).toBe(BooleanLiteralBuilder.NAME)
    expect(secondBool.type).toBe(BooleanLiteralBuilder.NAME)
    expect(thirdBool.type).toBe(BooleanLiteralBuilder.NAME)
    expect(fourthBool.type).toBe(BooleanLiteralBuilder.NAME)
    expect(firstBool.value).toBe(true)
    expect(secondBool.value).toBe(false)
    expect(thirdBool.value).toBe(true)
    expect(fourthBool.value).toBe(false)
  })

  it('can parse string literal', () => {
    let firstString = ast.node.children?.[7] as StringLiteralNode
    let secondString = ast.node.children?.[8] as StringLiteralNode

    expect(firstString.type).toBe(StringLiteralBuilder.NAME)
    expect(secondString.type).toBe(StringLiteralBuilder.NAME)
    expect(firstString.value).toBe('Hello World')
    expect(secondString.value).toBe(' Hello World 2 ')
  })

  it('can parse nullish literal', () => {
    let firstNullish = ast.node.children?.[9] as NullishLiteralNode
    let secondNullish = ast.node.children?.[10] as NullishLiteralNode
    let thirdNullish = ast.node.children?.[11] as NullishLiteralNode
    let fourthNullish = ast.node.children?.[12] as NullishLiteralNode

    expect(firstNullish.type).toBe(NullishLiteralBuilder.NAME)
    expect(secondNullish.type).toBe(NullishLiteralBuilder.NAME)
    expect(thirdNullish.type).toBe(NullishLiteralBuilder.NAME)
    expect(fourthNullish.type).toBe(NullishLiteralBuilder.NAME)
    expect(firstNullish.keyword).toBe('undefined')
    expect(secondNullish.keyword).toBe('void')
    expect(thirdNullish.keyword).toBe('null')
    expect(fourthNullish.keyword).toBe('nothing')
  })
})
