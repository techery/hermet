import Model from './Model';
import { Schema, SchemaDefinition } from 'mongoose';

export class Stub extends Model {
    public response: any;
    public predicates: any;
    public serviceId: string;
    public ttl: number;
    public expireAt: Date;

    static get schema(): SchemaDefinition {
        return {
            response: {
                type: Schema.Types.Mixed,
                required: true
            },
            predicates: {
                type: Schema.Types.Mixed,
                required: true
            },
            serviceId: {
                type: String,
                required: true
            },
            ttl: Number,
            expireAt: Date
        };
    }
}

export default Stub.model;
