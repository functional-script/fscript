import { CommandLineParser } from './cli/CommandLineParser'
/**
 * This file is a part of fscript package
 */

export const test = 'test'

const cli = CommandLineParser.fromArg()

console.warn(cli.getArguments())
console.warn(cli.getOptions())
console.warn(cli.getShortOptions())
