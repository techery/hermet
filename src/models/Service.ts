import Model from './Model';
import { SchemaDefinition } from 'mongoose';

export class Service extends Model {
    public name: string;
    public targetUrl: string;
    public ttl: number;
    public expireAt: Date;

    static get schema(): SchemaDefinition {
        return {
            name: {
                type: String,
                required: true,
                unique: true
            },
            targetUrl: {
                type: String,
                required: true
            },
            ttl: Number,
            expireAt: Date
        };
    }
}

export default Service.model;
