import { createHmac } from "crypto";
import { Host } from "../interfaces/Host";

export class Gogs implements Host {

    public headers = {
        signature: 'x-gogs-signature',
        event: 'x-gogs-event'
    }

    validate(data: Buffer, hash: string, key: string): Boolean {
        return createHmac('sha256', key).update(data, 'utf8').digest('hex') === hash;
    }

}
