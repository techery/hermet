import { Router } from 'express';
import wrap from './wrapper';
import { servicesController } from '../container';

let router = Router({ mergeParams: true });

router.route('/')
    .get(wrap(async (req, res, next) => servicesController.list(req, res)))
    .post(wrap(async (req, res, next) => servicesController.create(req, res)));

router.route('/:serviceId')
    .get(wrap(async (req, res, next) => servicesController.get(req, res)))
    .put(wrap(async (req, res, next) => servicesController.update(req, res)))
    .delete(wrap(async (req, res, next) => servicesController.remove(req, res)));

export default router;
