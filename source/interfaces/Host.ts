export interface Host {
    validate(data: Buffer, hash: string, key: string): Boolean
    headers: {
        signature: string,
        event: string,
    }
}
