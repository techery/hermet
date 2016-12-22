export default class ProxyError extends Error {
    public httpCode: number;

    constructor(httpCode: number, message: string) {
        super(message);

        this.name = 'ProxyError';
        this.httpCode = httpCode;
    }
}
