#!/usr/bin/env node

import { spawn } from "child_process";
import * as kill from "kill-port";
import * as yargs from "yargs-parser";

const file = require.resolve('./WebHook.js')
const args = process.argv.slice(2);
const options = Object.assign({ port: 7070 }, yargs(args))

if (options['_'].includes('stop')) {
    kill(options.port)
} else {
    kill(options.port)
        .then(() => spawn('node', [file, ...args], { stdio: 'ignore', detached: true }).unref());
}
