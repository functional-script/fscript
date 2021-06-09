export type LongOption = {
  [key: string]: string | boolean;
}

/**
 * Represent a command line parser
 */
export class CommandLine
{
  private shortOptions: string[];

  private longOptions: LongOption;
  
  private arguments: string[];

  /**
   * Create a command line from the process.argv
   */
  public static fromArg(): CommandLine
  {
    return new CommandLine(process.argv.slice(2));
  }

  public constructor(argv: string[])
  {
    this.shortOptions = this.parseShortOptions(argv);
    this.longOptions = this.parseLongOptions(argv);
    this.arguments = this.parseArguments(argv);
  }

  /**
   * Test if an option exists
   */
  public hasOption(name: string): boolean
  {
    return this.longOptions[name] !== undefined;
  }

  /**
   * Retrieve the options
   */
  public getOptions(): LongOption
  {
    return this.longOptions;
  }

  /**
   * Retrieve the arguments
   */
  public getArguments(): string[]
  {
    return this.arguments;
  }

  /**
   * Retrieve all the short options
   */
  public getShortOptions(): string[]
  {
    return this.shortOptions;
  }

  /**
   * Test if a given short option has been set
   */
  public hasShortOption(name: string): boolean
  {
    let opts: string[] = [ ...name ];

    for (let opt in this.shortOptions) {
      if (-1 === opts.indexOf(opt)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Parse the arguments of a command line
   */
  private parseArguments(argv: string[]): string[]
  {
    return argv
      .filter((e, i, d) =>
        !this.isOption(e)
        && !this.isLongOption(d[i - 1])
      )
    ;
  }

  /**
   * Parse the long options of a command line
   */
  private parseLongOptions(argv: string[]): LongOption
  {
    return argv
      .reduce<LongOption>((acc, v, i) => {
        if (!this.isLongOption(v)) {
          return acc;
        }

        let key = v.replace(/-/g, '');
        let value: string | boolean = argv[i + 1] || '';

        if (!value || /^-[a-zA-Z0-9-]+/.test(value)) {
          value = true;
        }

        return { ...acc, [key]: value }
      }, {})
  }

  /**
   * Parse the arguments of a command line
   */
  private parseShortOptions(argv: string[]): string[]
  {
    return argv
      .filter(e => /^-[a-zA-Z0-9]+/.test(e))
      .map(s => s.replace(/-/g, ''))
      .reduce<string[]>((acc, v) => {
        if (v.length === 1) {
          return [ ...acc, v];
        }

        return [...acc, ...v];
      }, [])
    ;
  }

  /**
   * Test if a given string is a command line option
   */
  private isOption(subject?: string): boolean
  {
    return subject ? /^-/.test(subject) : false;
  }

  /**
   * Test if a given string is a long command line option
   */
  private isLongOption(subject?: string): boolean
  {
    return subject ? /^--/.test(subject) : false;
  }
}