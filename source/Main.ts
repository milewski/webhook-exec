#!/usr/bin/env node

import { spawn } from "child_process";
import * as kill from "fkill";
import * as fs from "fs-extra";

const file = require.resolve('./WebHook.js')

new Promise(resolve => {

    const process = spawn(`node ${file}`, [], { stdio: 'inherit', shell: true })
    let pid;

    try {
        pid = fs.readFileSync('process.pid');
    } catch (e) {
        // do nothing
    }

    return resolve({ process, pid })

}).then(({ process, pid }) => {

    if (pid) {
        return kill(pid.toString()).then(() => process)
    }

    return process

}).then(process => {

    let pidFile = fs.createWriteStream('process.pid');
    pidFile.write(process.pid.toString());
    pidFile.end();

    process.unref();

})


