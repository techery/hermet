import {Router} from 'express';
import wrap from './wrapper';
import {historyController} from '../container';

let router = Router();

router.route('/:serviceId/logs')
    .get(wrap(async (req, res, next) => historyController.list(req, res)));

export default router;
