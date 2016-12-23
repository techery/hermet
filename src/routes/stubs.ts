import {Router, Response} from 'express';
import wrap from './wrapper';
import {stubsController} from '../container';
import {SessionRequest} from '../interfaces/requests/SessionRequest';

let router = Router();

router.route('/:serviceId/stubs')
  .get(wrap(async (req: SessionRequest, res: Response, next: Function) => stubsController.list(req, res)))
  .post(wrap(async (req: SessionRequest, res: Response, next: Function) => stubsController.create(req, res)))
  .delete(wrap(async (req: SessionRequest, res: Response, next: Function) => stubsController.removeAll(req, res)));

router.route('/:serviceId/stubs/:stubId')
  .get(wrap(async (req: SessionRequest, res: Response, next: Function) => stubsController.get(req, res)))
  .put(wrap(async (req: SessionRequest, res: Response, next: Function) => stubsController.update(req, res)))
  .delete(wrap(async (req: SessionRequest, res: Response, next: Function) => stubsController.remove(req, res)));

export default router;
