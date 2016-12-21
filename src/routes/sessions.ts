import {Router} from 'express';
import wrap from './wrapper';
import {sessionController} from '../container';

let router = Router({mergeParams: true});

router.route('/')
  .get(wrap(async (req, res, next) => sessionController.list(req, res)))
  .post(wrap(async (req, res, next) => sessionController.create(req, res)));

router.route('/:sessionId')
  .get(wrap(async (req, res, next) => sessionController.get(req, res)))
  .put(wrap(async (req, res, next) => sessionController.update(req, res)))
  .delete(wrap(async (req, res, next) => sessionController.remove(req, res)));

export default router;
