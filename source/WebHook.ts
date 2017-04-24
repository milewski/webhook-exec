#!/usr/bin/env node

import { createServer, Server } from 'http';
import { exec, spawnSync } from 'child_process';
import * as path from 'path';
import { createHmac } from 'crypto';

export class WebHook {

    private server: Server

    constructor() {

        this.server = createServer((request, response) => {

            const chunks = [];

            request.on('data', chunk => chunks.push(chunk));
            request.on('end', () => {

                const { signature, event } = this.parseHeaders(request.headers)

                if (this.validate(Buffer.concat(chunks), signature, '123456')) {

                    this.run(event).then(() => console.log('completed'))

                    response.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ okay: true }))

                }

            })

        })

        // this.server.listen(7070, '192.168.1.227');

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
