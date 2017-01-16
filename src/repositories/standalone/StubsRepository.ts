import BaseRepository from './BaseRepository';

export const MODEL_TYPE_STUB = 'stub';

export default class StubsRepository extends BaseRepository {

    /**
     * @returns {Promise}
     */
    public all(params: any = {}): any[] {
        let collection: any[] = this.storage[this.getType()];
        return Object.keys(collection).map(id => {
            return collection[id];
        }).filter(item => {
            return Object.keys(params).every((element: any, index: number, array: any[]) => {
                return params[element] === item[element];
            });
        });
    }

    /**
     * @returns {Promise}
     */
    public removeAll(params: any = {}): any {
        this.all(params).map(item => {
            delete(this.storage[this.getType()][item.id]);
        });

    }

    protected getType(): string {
        return MODEL_TYPE_STUB;
    }
}
