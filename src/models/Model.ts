import mongoose from '../database';
import { Model as MongooseModel, SchemaDefinition } from 'mongoose';

abstract class Model {
    /* tslint:disable-next-line:variable-name */
    public _id: string;
    public createdAt: Date;
    public updatedAt: Date;

    static get schema(): SchemaDefinition {
        return {};
    }

    static get timestamps(): Object {
        return {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        };
    }

    static get model(): MongooseModel<any> {
        const schema = new mongoose.Schema(this.schema, { timestamps: this.timestamps });

        schema.set('toJSON', {
            virtuals: true,
            transform: (doc: any, ret: any): any => {
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        });

        return mongoose.model(this.prototype.constructor.name, schema.loadClass(this));
    }
}

export default Model;
