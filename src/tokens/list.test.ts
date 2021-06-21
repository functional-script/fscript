import { TokenList } from './list'

describe('A token list', () => {
  const list = new TokenList([
    {
      name: 'A',
      value: 'test',
      rawValue: 'test',
      position: {
        line: 1,
        start: 0,
        end: 3,
      },
    },
    {
      name: 'B',
      value: 'test2',
      rawValue: 'test2',
      position: {
        line: 1,
        start: 4,
        end: 7,
      },
    },
  ])

  it('contains a series of tokens', () => {
    expect(list.length).toBe(2)
  })

  it('can find a givent token', () => {
    expect(list.has(1, 2)).toBe(true)

    expect(list.at(1, 2).name).toBe('A')

    expect(list.at(1, 4).name).toBe('B')

    expect(() => {
      list.at(5, 5)
    }).toThrowError(RangeError)

    expect(list.find(t => 'A' === t.name).name).toBe('A')

    expect(() => {
      list.find(({ name }) => name === 'No')
    }).toThrowError(RangeError)
  })

  it('can loops over tokens and produces effects', () => {
    let names: string[] = []

    list.each(token => names.push(token.name))

    expect(names).toEqual(['A', 'B'])
  })

  it('can remove token at the given position', () => {
    let newList = list.remove(1, 2)

    expect(newList.length).toBe(1)

    expect(list.length).toBe(2)
  })

  it('filters tokens', () => {
    let newList = list.filter(({ name }) => name !== 'B')

    expect(newList.length).toBe(1)

    expect(list.length).not.toBe(newList.length)
  })
})
