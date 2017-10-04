import Repository from './Repository';
import {Service} from '../../models/Service';

export default class ServiceRepository extends Repository {
    protected collectionName: string = 'service';
    protected model: any = Service;
}
