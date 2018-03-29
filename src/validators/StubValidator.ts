let deepDiff = require('deep-diff');
import { Stub } from '../models/Stub';
import ValidationError from '../errors/ValidationError';

export default class StubValidator {

    public validate(stub: any, items: any[]): any {
        items.forEach((item: Stub): void => {
            if (!this.compare(stub.predicates, item.predicates)) {
                throw new ValidationError(400, 'Stub has a collision with another stub with id [' + item._id + ']');
            }
        });
    }

    private compare(currentPredicates: any, existingPredicates: any): boolean {

        let differences = deepDiff.diff(
            currentPredicates,
            existingPredicates
        );

        if (!differences) {
            return false;
        }

        let newDiff: any[] = [];
        let deleteDiff: any[] = [];
        let isValid = false;

        differences.forEach((difference: any) => {
            const diffKind = difference.kind;
            if (diffKind !== 'N' && diffKind !== 'D') {
                isValid = true;
            }

            if (difference.kind === 'N') {
                newDiff.push(difference);
            }
            if (difference.kind === 'D') {
                deleteDiff.push(difference);
            }
        });

        if (isValid) {
            return true;
        }

        if (newDiff.length === differences.length) {
            return false;
        }

        return deleteDiff.length !== differences.length;
    }
}
