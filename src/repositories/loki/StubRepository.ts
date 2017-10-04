import Repository from './Repository';
import {Stub} from '../../models/Stub';

export default class StubRepository extends Repository {
    protected collectionName: string = 'stub';
    protected model: any = Stub;
}
