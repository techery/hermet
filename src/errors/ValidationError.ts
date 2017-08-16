export default class ValidationError extends Error {
    public httpCode: number;

    constructor(httpCode: number, message: string) {
        super(message);

        this.name = 'ValidationError';
        this.httpCode = httpCode;
    }
}
