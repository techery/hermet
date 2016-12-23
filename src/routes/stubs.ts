import {Router} from 'express';
import wrap from './wrapper';
import {stubsController} from '../container';
import {SessionRequest} from '../interfaces/requests/SessionRequest';

let router = Router();

router.route('/:serviceId/stubs')
  .get(wrap(async (req: SessionRequest, res, next) => stubsController.list(req, res)))
  .post(wrap(async (req: SessionRequest, res, next) => stubsController.create(req, res)))
  .delete(wrap(async (req: SessionRequest, res, next) => stubsController.removeAll(req, res)));

router.route('/:serviceId/stubs/:stubId')
  .get(wrap(async (req: SessionRequest, res, next) => stubsController.get(req, res)))
  .put(wrap(async (req: SessionRequest, res, next) => stubsController.update(req, res)))
  .delete(wrap(async (req: SessionRequest, res, next) => stubsController.remove(req, res)));

export default router;
