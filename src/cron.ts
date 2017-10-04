import {serviceRepository, sessionRepository, stubRepository} from './container';
import * as moment from 'moment';
import {Base} from './models/Base';
import Repository from './repositories/loki/Repository';

let cron = require('node-cron');

export default () => {
    cron.schedule('*/15 * * * * *', (): any => {
        function removeExpiredItems(repository: Repository): void {
            repository.removeWhere((item: Base) => {
                return item.expireAt !== null && moment().isAfter(item.expireAt);
            });
        }

        removeExpiredItems(stubRepository);
        removeExpiredItems(serviceRepository);
        removeExpiredItems(sessionRepository);
    });
};
