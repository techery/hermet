import {Router} from 'express';
import wrap from './wrapper';
import {flushController} from '../container';

let router = Router({mergeParams: true});

router.route('/').post(wrap(async (req, res, next) => flushController.flush(req, res)));

export default router;
