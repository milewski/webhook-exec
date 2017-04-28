import { createHmac } from "crypto";
import { Host } from "../interfaces/Host";

export class Github implements Host {

    public headers = {
        signature: 'x-hub-signature',
        event: 'x-github-event'
    }

    validate(data: Buffer, hash: string, key: string): Boolean {
        return ('sha1=' + createHmac('sha1', key).update(data, 'utf8').digest('hex')) === hash;
    }

}
