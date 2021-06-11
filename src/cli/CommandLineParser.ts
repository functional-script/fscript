import { CliError } from './CliError'

/**
 * Represent a given Option inside the command line
 */
export interface Option {
  type: 'SHORT' | 'LONG'
  value: string | boolean
}

/**
 * This is the collection of all options in the
 * command line
 */
export interface OptionCollection {
  [key: string]: Option
}

/**
 * Represent a command line parser
 */
export class CommandLineParser {
  private options: OptionCollection

  private arguments: string[]

  /**
   * Create a command line from the process.argv
   */
  public static fromArg(): CommandLineParser {
    return new CommandLineParser(process.argv.slice(2))
  }

  public constructor(argv: string[]) {
    this.options = this.parseOptions(argv)
    this.arguments = this.parseArguments(argv)
  }

  /**
   * Retrieve all options and there values
   */
  public get opts(): { [key: string]: string | boolean } {
    return Object.entries(this.options).reduce(
      (acc, [key, option]) => ({
        ...acc,
        [key]: option.value,
      }),
      {},
    )
  }

  /**
   * Retrieve only the short options and there values
   */
  public get shortOpts(): { [key: string]: string | boolean } {
    return Object.entries(this.options)
      .filter(([k, opt]) => opt.type === 'SHORT')
      .reduce(
        (acc, [key, option]) => ({
          ...acc,
          [key]: option.value,
        }),
        {},
      )
  }

  /**
   * Retrieve only the long options and there values
   */
  public get longOpts(): { [key: string]: string | boolean } {
    return Object.entries(this.options)
      .filter(([k, opt]) => opt.type === 'LONG')
      .reduce(
        (acc, [key, option]) => ({
          ...acc,
          [key]: option.value,
        }),
        {},
      )
  }

  /**
   * Retrieve all the arguments
   */
  public get args(): string[] {
    return this.arguments
  }

  /**
   * Retrieve a given option by it's name
   */
  public option(name: string): string | boolean {
    if (!this.options[name]) {
      throw new CliError(`The option ${name} does not exists`)
    }

    return this.options[name].value
  }

  /**
   * Retrieve a agument by it's index
   */
  public arg(index: number = 0): string {
    if (!this.arguments[index]) {
      throw new CliError(
        `No arguments has been provided for the index ${index}`,
      )
    }

    return this.arguments[index]
  }

  /**
   * Test if an option exists
   */
  public has(name: string): boolean {
    return !!this.options[name]
  }

  /**
   * Parse the arguments of a command line
   */
  private parseArguments(argv: string[]): string[] {
    return argv.filter((arg, index) => {
      if (/^-/.test(arg)) {
        return false
      }

      let previousArg = argv[index - 1]

      if (!previousArg) {
        return true
      }

      if (/^-/.test(previousArg)) {
        return false
      }
    })
  }

  /**
   * Parse the long options of a command line
   */
  private parseOptions(argv: string[]): OptionCollection {
    const collection: OptionCollection = {}

    return argv.reduce<OptionCollection>((acc, value, index) => {
      if (!/^-/.test(value)) {
        return acc
      }

      let isLong: boolean = /^--/.test(value)
      let key = value.replace(/^--?/g, '')
      let storedValue: string | boolean = argv[index + 1] || ''

      if (!storedValue || /^-[a-zA-Z0-9-]+/.test(storedValue)) {
        storedValue = true
      }

      return {
        ...acc,
        [key]: {
          type: isLong ? 'LONG' : 'SHORT',
          value: storedValue,
        },
      }
    }, collection)
  }
}
