import { Host } from "../interfaces/Host";

export class Bitbucket implements Host {

    public headers = {
        signature: 'x-hub-signature',
        event: 'x-event-key'
    }

    validate(data: Buffer, hash: string, key: string): Boolean {
        return true;
    }

}
