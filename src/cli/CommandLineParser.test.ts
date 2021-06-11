import { CommandLineParser } from './CommandLineParser'
import { CliError } from './CliError'

describe('cli.CommandLineParser', () => {
  const parser = new CommandLineParser([
    'start',
    '--verbose',
    '-t',
    '/some/path',
    '--port',
    '8989',
  ])

  it('Can parse command line options, arguments and short options', () => {
    expect(parser.arg()).toEqual('start')

    expect(parser.option('verbose')).toEqual(true)
    expect(parser.option('t')).toEqual('/some/path')
    expect(parser.option('port')).toEqual('8989')

    expect(parser.has('verbose')).toBe(true)
    expect(parser.has('name')).toBe(false)
  })

  it('Throws cli error on unexisting option or arguments', () => {
    expect(() => {
      parser.option('unknown')
    }).toThrow(CliError)
    expect(() => {
      parser.arg(2)
    }).toThrow(CliError)
  })

  it('Can retrieves all arguments, options, short options and long ones', () => {
    expect(parser.args).toEqual(['start'])

    expect(parser.opts).toMatchObject({
      verbose: true,
      t: '/some/path',
      port: '8989',
    })

    expect(parser.longOpts).toMatchObject({
      verbose: true,
      port: '8989',
    })

    expect(parser.shortOpts).toMatchObject({
      t: '/some/path',
    })
  })
})
