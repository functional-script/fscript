/**
 * This is the error throwned when something
 * wrong happens in the command line
 */
export class CliError extends Error {
  constructor(...args: any[]) {
    super(...args)

    this.name = 'Error(Cli)'
    this.message = `Error(Cli): ${this.message}`

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
