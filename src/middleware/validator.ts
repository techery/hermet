import {Response} from 'express';
import {SessionRequest} from '../interfaces/requests/SessionRequest';

export default (req: SessionRequest, res: Response, next: Function, schema: any) => {
    req.checkBody(schema);

    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            res.status(400).json({errors: result.useFirstErrorOnly().mapped()});
            return;
        }
        next();
    }).catch(err => {
        throw new Error('Validation error: ' + err.message);
    });
};
