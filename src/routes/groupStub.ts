import {Router} from 'express';
import wrap from './wrapper';
import {stubsController} from '../container';

let router = Router({mergeParams: true});

router.route('/')
    .delete(wrap(async (req, res, next) => stubsController.removeAll(req, res)));

export default router;
