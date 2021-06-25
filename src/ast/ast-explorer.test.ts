import yaml from 'yaml'
import { AstExplorer } from './ast-explorer'
import { Node } from './types'

describe('An AST tree explorer', () => {
  let nodes: Node = yaml.parse(`
    type: foo
    children:
      - type: bar
        children:
          - type: baz
            children:
              - type: super_baz
                children: []
              - type: super_baz
                children: []
                test: yes
          - type: superBar
            children: []
          - type: superBar
            children: []
      - type: superFoo
        children: []
      - type: superFoo
        children: []
  `)
  let explorer: AstExplorer

  beforeEach(() => {
    explorer = new AstExplorer(nodes)
  })

  it('can parse a given AST cursor into a collection of AST path', () => {
    let p = { index: 0 }
    let p2 = { type: 'test', n: 2 }

    expect(AstExplorer.isNamedPath(p)).toBe(false)
    expect(AstExplorer.isNamedPath(p2)).toBe(true)
    expect(AstExplorer.isIndexedPath(p)).toBe(true)
    expect(AstExplorer.isIndexedPath(p2)).toBe(false)

    let paths = AstExplorer.parseCursor('foo:1.5.bar:2.baz')

    expect(paths).toEqual([
      { type: 'foo', n: 1 },
      { index: 5 },
      { type: 'bar', n: 2 },
      { type: 'baz', n: 0 },
    ])

    let cursor = AstExplorer.parsePath(paths)

    expect(cursor).toBe('foo:1.5.bar:2.baz')
  })

  it('can test the existence of a given path', () => {
    expect(explorer.node).toMatchObject(nodes)
    expect(explorer.node.type).toBe('foo')
    expect(explorer.length).toBe(3)
    expect(explorer.cursor).toBe('')

    expect(explorer.has('bar')).toBe(true)
    expect(explorer.has('bar.baz')).toBe(true)
    expect(explorer.has('bar.none')).toBe(false)
    expect(explorer.has('nope')).toBe(false)

    expect(explorer.has('0')).toBe(true)
    expect(explorer.has('8')).toBe(false)

    expect(explorer.has('0.0')).toBe(true)
    expect(explorer.has('0.8')).toBe(false)

    expect(explorer.has('bar.baz:1')).toBe(false)
    expect(explorer.has('bar.baz:0')).toBe(true)

    expect(explorer.has('bar.superBar:1')).toBe(true)
    expect(explorer.has('bar.superBar:2')).toBe(false)
  })

  it('can go to a given path and then go back', () => {
    explorer.go('bar')

    expect(explorer.node.type).toBe('bar')

    explorer.back()

    expect(explorer.node.type).toBe('foo')

    explorer.go('bar.baz')

    expect(explorer.node.type).toBe('baz')

    explorer.back()
    explorer.back()

    expect(explorer.isRoot).toBe(true)

    explorer.go('bar.baz.super_baz:1')

    expect((explorer.node as any)['test']).toBeDefined()
    expect((explorer.node as any)['test']).toBe('yes')
  })

  it('can go back to the root AST tree', () => {
    explorer.go('bar.baz')

    expect(explorer.node.type).toBe('baz')

    explorer.root()

    expect(explorer.node.type).toBe('foo')
  })

  it('can save a cursor and go back to that cursor later on', () => {
    explorer.go('bar.baz')

    explorer.save('test')

    expect(explorer.node.type).toBe('baz')

    explorer.root()

    expect(explorer.node.type).toBe('foo')

    explorer.load('test')

    expect(explorer.node.type).toBe('baz')
  })

  it('can go to the previous token of a given type inside the AST', () => {
    explorer.go('bar.baz.super_baz:1')

    expect(explorer.hasPrevious('foo')).toBe(true)
    expect(explorer.hasPrevious('bar')).toBe(true)
    expect(explorer.hasPrevious('baz')).toBe(true)

    explorer.previous('bar')

    expect(explorer.cursor).toBe('bar')

    expect(explorer.hasNext('super_baz')).toBe(true)
    expect(explorer.hasNext('none')).toBe(false)

    expect(explorer.cursor).toBe('bar')
    expect(explorer.has('0.0')).toBe(true)

    explorer.next('super_baz')

    expect(explorer.cursor).toBe('bar.0.0')
  })

  it('can add a node to the given children of the current node', () => {
    explorer.go('bar.baz')

    explorer.add({ type: 'customNode' })

    expect(explorer.cursor).toBe('bar.baz')
    expect(explorer.has('customNode')).toBe(true)

    explorer.root()

    expect(explorer.has('bar.baz.customNode')).toBe(true)
  })
})
