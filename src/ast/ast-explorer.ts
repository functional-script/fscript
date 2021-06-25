import { Node } from './types'

/**
 * This type represent the ability of a string to define an AST
 * path.
 *
 * like "somenode:4.someothernode:0" wich means : the node
 * of type "somenode" number 4 followed by the first node "someothernode"
 */
export type AstCursor = string

/**
 * Represent a given named path
 */
export type AstNamedPath = {
  type: string
  n: number
}

/**
 * Represent a given indexed path
 */
export type AstIndexedPath = {
  index: number
}

/**
 * Represent a generic indexed path
 */
export type AstPath = AstNamedPath | AstIndexedPath

/**
 * This class is used in order to explore easily
 * an AST Tree
 *
 * Like token explorer it uses cursor
 */
export class AstExplorer {
  private ast: Node

  private path: AstCursor

  private composedPath: AstPath[]

  private currentNode: Node

  private history: { [key: string]: AstCursor }

  /**
   * Parse a given cursor into an ast path collection
   */
  public static parseCursor(path: AstCursor): AstPath[] {
    let collection: AstPath[] = []

    let members = path
      .split('.')
      .map(p => p.trim())
      .filter(p => !!p)

    for (let member of members) {
      let [type, index] = member.split(':')

      if (/^\d+$/.test(type) && !index) {
        collection.push({
          index: parseInt(type),
        })

        continue
      }

      collection.push({
        type,
        n: index ? parseInt(index) : 0,
      })
    }

    return collection
  }

  /**
   * Parse a path into an ast cursor
   */
  public static parsePath(paths: AstPath[]): AstCursor {
    let cursor: string[] = []

    for (let path of paths) {
      if (AstExplorer.isNamedPath(path)) {
        cursor.push(`${path.type}${path.n ? `:${path.n}` : ''}`)

        continue
      }

      cursor.push(`${path.index}`)
    }

    return cursor.join('.')
  }

  /**
   * Test if the given subject is a named path
   */
  public static isNamedPath(path: AstPath): path is AstNamedPath {
    return undefined !== (path as AstNamedPath).type
  }

  /**
   * Test if the given subject is a indexed path
   */
  public static isIndexedPath(path: AstPath): path is AstIndexedPath {
    return undefined !== (path as AstIndexedPath).index
  }

  /**
   * Retrieve a child node at the given path
   */
  public static getNodeAtPath(node: Node, path: AstPath): Node {
    if (!node.children) {
      throw new RangeError(`The node ${node.type} does not have any children`)
    }

    if (AstExplorer.isNamedPath(path)) {
      let nodes = node.children.filter(n => n.type === path.type)
      let newNode = nodes ? nodes[path.n] : undefined

      if (undefined === newNode) {
        throw new RangeError(
          `There is no node ${path.type} at ${path.n} inside the node ${node.type}`,
        )
      }

      return newNode
    }

    let newNode = node?.children?.[path.index]

    if (undefined === newNode) {
      throw new RangeError(
        `There is no child node ${path.index} inside the node ${node.type}`,
      )
    }

    return newNode
  }

  public constructor(ast: Node) {
    this.ast = ast
    this.path = ''
    this.composedPath = []
    this.currentNode = this.ast
    this.history = {}
  }

  /**
   * Retrieve the current node at wich the cursor
   * is pointing on
   */
  public get node(): Node {
    return this.currentNode
  }

  /**
   * Retrieve all the child nodes at teh given node
   */
  public get children(): Node[] {
    return this.currentNode?.children || []
  }

  /**
   * Count the number of children inside the current node
   */
  public get length(): number {
    return this.currentNode?.children?.length ?? 0
  }

  /**
   * retrieve the current cursor
   */
  public get cursor(): AstCursor {
    return this.path
  }

  /**
   * Test if the given cursor it at the root level
   */
  public get isRoot(): boolean {
    return '' === this.cursor
  }

  /**
   * Test of the given path exists at the given node
   */
  public has(cursor: AstCursor, node: Node | null = null): boolean {
    node = node ?? this.currentNode
    let paths = AstExplorer.parseCursor(cursor)
    let [path, ...restPath] = paths

    if (!path) {
      return true
    }

    try {
      let newNode = AstExplorer.getNodeAtPath(node, path)

      return this.has(AstExplorer.parsePath(restPath), newNode)
    } catch (e) {
      return false
    }
  }

  /**
   * Go to the given path
   */
  public go(cursor: AstCursor, node: Node | null = null): this {
    if (null === node) {
      if (!this.has(cursor)) {
        throw new RangeError(
          `Unable to go to the path ${cursor} into the AST at « ${this.cursor} »`,
        )
      }

      this.composedPath = AstExplorer.parseCursor(
        this.cursor ? `${this.cursor}.${cursor}` : cursor,
      )
      this.path = AstExplorer.parsePath(this.composedPath)

      return this.go(cursor, this.currentNode)
    }

    let paths = AstExplorer.parseCursor(cursor)

    let [path, ...restPaths] = paths

    if (!path) {
      this.currentNode = node

      return this
    }

    let newNode = AstExplorer.getNodeAtPath(node, path)

    return this.go(AstExplorer.parsePath(restPaths), newNode)
  }

  /**
   * Go back into the explorer
   */
  public back(n: number = 1): this {
    if (n <= 0 || this.composedPath.length === 0) {
      return this
    }

    this.composedPath.pop()
    this.path = AstExplorer.parsePath(this.composedPath)

    this.go(this.path, this.ast)

    return this.back(n - 1)
  }

  /**
   * Go to the root of the AST
   */
  public root(): this {
    this.composedPath = []
    this.path = ''
    this.currentNode = this.ast

    return this
  }

  /**
   * Save the current path to be restore later on
   */
  public save(key: string): this {
    this.history[key] = this.cursor

    return this
  }

  /**
   * Restore the saved path
   */
  public load(key: string): this {
    if (!this.history[key]) {
      throw new RangeError(`There is no AST cursor named ${key} in the history`)
    }

    this.root()

    this.go(this.history[key])

    return this
  }

  /**
   * Restore to the first cursor in the history and clear
   * the history
   */
  public reset(): this {
    let keys = Object.keys(this.history)

    if (keys.length === 0) {
      return this
    }

    this.load(this.history[keys[0]])

    this.history = {}

    return this
  }

  /**
   * Test if there is a previous Node with the given
   * type
   */
  public hasPrevious(type: string, start: boolean = true): boolean {
    if (start) {
      this.save('__previous')
    }

    if (this.isRoot) {
      this.load('__previous')

      delete this.history['__previous']

      return false
    }

    this.back()

    if (this.node.type === type) {
      this.load('__previous')

      delete this.history['__previous']

      return true
    }

    return this.hasPrevious(type, false)
  }

  /**
   * Test if there is a next node with the given
   * type
   */
  public hasNext(type: string, node: Node | null = null): boolean {
    node = node ?? this.currentNode

    if (!node.children) {
      return false
    }

    let found = node?.children?.find(node => node.type === type)

    if (found) return true

    for (let child of node.children) {
      if (this.hasNext(type, child)) {
        return true
      }
    }

    return false
  }

  /**
   * Go to the first previous node at the given path
   */
  public previous(type: string, start: boolean = true): this {
    if (start && !this.hasPrevious(type)) {
      throw new RangeError(
        `There is no previous node of type ${type} at ${this.cursor}`,
      )
    }

    if (this.node.type === type) {
      return this
    }

    this.back()

    return this.previous(type, false)
  }

  /**
   * Go to the first next node at the given path
   */
  public next(
    type: string,
    node: Node | null = null,
    start: boolean = true,
    savedCursor: string = '',
  ): this {
    if (start && !this.hasNext(type)) {
      throw new RangeError(
        `There is no next node of type ${type} at ${this.cursor}`,
      )
    }

    node = node ?? this.currentNode
    let children = node?.children || []

    for (let i in children) {
      let child = children[i]
      let cursor = `${i}`

      if (child.type === type) {
        this.go(savedCursor ? `${savedCursor}.${cursor}` : cursor)

        return this
      }
    }

    for (let i in children) {
      let child = children[i]
      let cursor = `${i}`

      try {
        this.next(
          type,
          child,
          false,
          savedCursor ? `${savedCursor}.${cursor}` : cursor,
        )

        break
      } catch (e) {}
    }

    return this
  }

  /**
   * Add a node into the children of the given node
   */
  public add(node: Node, start: boolean = true): this {
    if (start) {
      this.save('__add_node')
    }

    this.currentNode.children = [...(this.currentNode?.children || []), node]

    if (this.isRoot) {
      this.ast = { ...this.currentNode }

      this.load('__add_node')

      delete this.history['__add_node']

      return this
    }

    this.back()

    return this.add(this.currentNode, false)
  }
}
