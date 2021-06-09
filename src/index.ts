import { CommandLine } from './cli/CommandLine';
/**
 * This file is a part of fscript package
 */

export const test = 'test'

const cli = CommandLine.fromArg();

console.warn(cli.getArguments());
console.warn(cli.getOptions());
console.warn(cli.getShortOptions());
