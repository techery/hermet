import {Request, Response, Router, static as staticFiles} from 'express';
import services from './services';
import stubs from './stubs';
import sessions from './sessions';
import wrap from './wrapper';
import {documentationController, flushController, stubsController} from '../container';

let router = Router({mergeParams: true});

router.use('/', staticFiles('documents/swagger'));
router.get('/', wrap((req, res, next) => documentationController.show(req, res)));

router.delete('/api/stubs', wrap((req, res, next) => stubsController.removeAll(req, res)));
router.post('/api/flush', wrap(async (req, res, next) => flushController.flush(req, res)));

router.use('/api/services', services);
router.use('/api/services', stubs);
router.use('/api/sessions', sessions);

export default router;
