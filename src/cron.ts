import {
    serviceRepository,
    stubsRepository, sessionRepository
} from './container';
import * as moment from 'moment';
import {Base} from './models/Base';
let cron = require('node-cron');

export default () => {
    cron.schedule('*/15 * * * * *', (): any => {
        async function removeExpiredItems(repository: Repository): Promise<any> {
            let items: Base[] = await repository.all({});
            items.forEach((item: Base) => {
                if (moment().isAfter(item.expireAt)) {
                    serviceRepository.remove(item.id);
                }
            });
        }
        removeExpiredItems(stubsRepository);
        removeExpiredItems(serviceRepository);
        removeExpiredItems(sessionRepository);
    });
};
