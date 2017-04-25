#!/usr/bin/env node

import { createServer, Server } from "http";
import { exec, spawnSync } from "child_process";
import * as path from "path";
import { createHmac } from "crypto";
import * as yargs from "yargs-parser";

export class WebHook {

    private server: Server
    private options = {
        port: 7070,
        host: 'localhost',
        secret: null
    }

    constructor(options = {}) {

        this.options = Object.assign(this.options, options, yargs(process.argv.slice(2)))

        this.server = createServer((request, response) => {

            const chunks = [];

            request.on('data', chunk => chunks.push(chunk));
            request.on('end', () => {

                const { signature, event } = this.parseHeaders(request.headers)

                if (this.validate(Buffer.concat(chunks), signature, this.options.secret.toString())) {

                    this.run(event).then(() => console.log('completed'))

                    response.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ okay: true }))

                }

            })

        })

        this.server.listen(this.options.port, this.options.host);

    }

    private getPackageJson(): Promise<string> {
        return new Promise(resolve => {
            exec('npm prefix').stdout.on('data', (root: Buffer) => {
                resolve(require(path.resolve(root.toString('utf8').trim(), 'package.json')))
            });
        })
    }

    private run(action: string) {

        return this
            .getPackageJson()
            .then(config => {

                let commands = config['webhooks'][action]

                if (typeof commands === 'string') {
                    commands = [commands]
                }

                return commands

            }).then(commands => {

                /**
                 * Execute the scripts
                 */
                commands.forEach(command => spawnSync(command, [], { stdio: 'inherit', shell: true }))

            })

    }

    private parseHeaders(headers: { [key: string]: string }) {

        const result = { signature: null, event: null }

        for (let header in headers) {

            const matches = header.match(/signature|event/);

            if (matches) {
                result[matches.shift()] = headers[header]
            }

        }

        return result;

    }

    private validate(data: Buffer, hash: string, key: string): Boolean {
        return createHmac('sha256', key).update(data, 'utf8').digest('hex') === hash;
    }

}

new WebHook()
