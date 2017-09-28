#!/usr/bin/env node

import { createServer, IncomingHttpHeaders, Server } from "http";
import { exec, spawnSync } from "child_process";
import * as path from "path";
import * as yargs from "yargs-parser";
import { Github } from "./hosts/Github";
import { Gogs } from "./hosts/Gogs";
import { Host } from "./interfaces/Host";
import { Bitbucket } from "./hosts/Bitbucket";
import { Gitlab } from "./hosts/Gitlab";

export class WebHook {

    private server: Server
    private options = {
        port: 7070,
        host: 'localhost',
        secret: '',
        server: 'github',
    }

    private host: Host;
    private hosts = {
        'github': Github,
        'gogs': Gogs,
        'bitbucket': Bitbucket,
        'gitlab': Gitlab
    }

    constructor(options = {}) {

        const { server, secret } = this.options = Object.assign(this.options, options, yargs(process.argv.slice(2)))

        if (!(server in this.hosts)) {
            throw new Error(`Unsupported server ${server}.`)
        }

        this.host = new this.hosts[ server ]
        this.server = createServer((request, response) => {

            const chunks = [];

            request.on('data', chunk => chunks.push(chunk));
            request.on('end', () => {

                const { signature, event } = this.parseHeaders(request.headers)

                if (this.host.validate(Buffer.concat(chunks), signature, secret.toString())) {

                    this.run(event)
                        .then(() => console.log('completed'))
                        .then(() => {
                            response.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
                            response.end(JSON.stringify({ okay: true }))
                        })

                } else {
                    response.writeHead(400, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ error: 'Invalid signature.' }))
                }

            })

        })

        this.server.listen(this.options.port, this.options.host);

    }

    private getPackageJson(): Promise<{ [key: string]: string }> {
        return new Promise(resolve => {
            exec('npm prefix').stdout.on('data', (root: Buffer) => {
                resolve(require(path.resolve(root.toString('utf8').trim(), 'package.json')))
            });
        })
    }

    private run(action: string) {

        return this
            .getPackageJson()
            .then(({ webhooks }) => {

                if (!webhooks) {
                    return Promise.reject('No webhook config found in your package.json')
                }

                if (!webhooks[ action ]) {
                    return Promise.reject(`There is no action defined for the ${action} event`)
                }

                let commands = webhooks[ action ]

                if (typeof commands === 'string') {
                    commands = [ commands ]
                }

                return commands

            }).then((commands: string[]) => {

                /**
                 * Execute the scripts
                 */
                commands.forEach(command => spawnSync(command, [], { stdio: 'inherit', shell: true }))

            })

    }

    private parseHeaders(headers: IncomingHttpHeaders) {
        return {
            signature: headers[ this.host.headers.signature ] as string,
            event: headers[ this.host.headers.event ] as string
        }
    }

}

new WebHook()
