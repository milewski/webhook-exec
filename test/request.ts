import { spawn } from "child_process";
import * as path from "path";
import * as http from "request";

const webhook = path.resolve(__dirname, '../source/Main.js');

export const request = ({ signature, data = {} }): Promise<any> => {

    let resolver, rejector,
        promise = new Promise((resolve, reject) => {
            resolver = resolve
            rejector = reject
        })

    let postData = { ...data },
        requestOptions = {
            url: 'http://localhost:7070',
            method: 'POST',
            body: postData,
            json: true,
            headers: {
                'X-Gogs-Signature': signature,
                'X-Gogs-Event': 'push'
            }
        };

    const hook = spawn('node', [ webhook, '--server', 'gogs', '--secret', '123456' ], { shell: true, cwd: __dirname })

    hook.on('exit', function () {
        setTimeout(() => {
            http(requestOptions, (error, response, body) => {
                if (error) rejector(error);
                resolver(body);
            })
        }, 500)
    })

    return promise
}
