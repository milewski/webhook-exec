import { Host } from "../interfaces/Host";

export class Gitlab implements Host {

    public headers = {
        signature: 'x-gitlab-token',
        event: 'x-gitlab-event'
    }

    validate(data: Buffer, hash: string, key: string): Boolean {
        return hash === key;
    }

}
