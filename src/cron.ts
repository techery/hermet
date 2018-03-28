import Stub from './models/Stub';
import Service from './models/Service';

let cron = require('node-cron');

export default () => {
    cron.schedule('*/15 * * * * *', (): any => {
        const query: any = { expireAt: { $ne: null, $exists: true, $gt: Date.now() } };

        Stub.remove(query);
        Service.remove(query);
    });
};
