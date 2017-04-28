import { exec, spawnSync } from "child_process";
import * as path from "path";
import * as expect from "expect.js";
import { request } from "./request";
import { createHmac } from "crypto";
import { unlinkSync } from "fs";

const main = path.resolve(__dirname, '../source/Main.js');
const webhook = path.resolve(__dirname, '../source/WebHook.js');

describe('Webhook', () => {

    beforeEach(() => {
        spawnSync('node', [main, 'stop']);
    })

    after(() => {
        spawnSync('node', [main, 'stop']);
        try {
            unlinkSync('./test/push.json')
        } catch (e) {
            //do nothing
        }
    })

    it('should fail if it\'s invoked with an invalid server', (done) => {

        exec(`node ${webhook} --server invalid`, error => {
            expect(error.toString()).to.match(/Unsupported server invalid/)
            done()
        })

    })

    it('should start a server normally', (done) => {

        const hook = spawnSync('node', [main, '--server', 'gogs'])
        expect(hook.stdout.toString()).to.match(/Your Webhook has been starter at: http:\/\/localhost:7070/)
        done()

    })

    it('should fail if receives an invalid signature', () => {

        return request({ signature: 'invalid-signature' })
            .then(data => expect(data.error).to.be('Invalid signature.'))

    })

    it('should pass if signature is correct && execute the hooks', () => {

        const data = { works: true };
        const signature = createHmac('sha256', '123456').update(JSON.stringify(data), 'utf8').digest('hex');

        return request({ signature, data })
            .then(data => expect(data).to.eql({ okay: true }))
            .then(() => expect(require('./push.json')).to.eql({ demo: 123 }))

    })

})
