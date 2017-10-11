import * as _ from 'lodash';

export default (ttl: any): boolean => {
    return _.isNull(ttl) || (_.isNumber(ttl) && ttl >= 0);
}
