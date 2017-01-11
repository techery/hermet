import {Router} from 'express';
import wrap from './wrapper';
import {servicesController} from '../container';
import validator from '../middleware/validator';
import schema from '../validators/schema';

let router = Router({mergeParams: true});

router.route('/')
  .get(wrap(async (req, res, next) => servicesController.list(req, res)))
  .post(
      (req, res, next) => validator(req, res, next, schema.service),
      wrap(async (req, res, next) => servicesController.create(req, res))
  );

router.route('/:serviceId')
  .get(wrap(async (req, res, next) => servicesController.get(req, res)))
  .put(wrap(async (req, res, next) => servicesController.update(req, res)))
  .delete(wrap(async (req, res, next) => servicesController.remove(req, res)));

export default router;
