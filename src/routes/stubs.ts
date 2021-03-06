import { Router } from 'express';
import wrap from './wrapper';
import { stubsController } from '../container';

let router = Router();

router.route('/:serviceId/stubs')
    .get(wrap(async (req, res, next) => stubsController.list(req, res)))
    .post(wrap(async (req, res, next) => stubsController.create(req, res)))
    .delete(wrap(async (req, res, next) => stubsController.removeAll(req, res)));

router.route('/:serviceId/stubs/:stubId')
    .get(wrap(async (req, res, next) => stubsController.get(req, res)))
    .put(wrap(async (req, res, next) => stubsController.update(req, res)))
    .delete(wrap(async (req, res, next) => stubsController.remove(req, res)));

export default router;
