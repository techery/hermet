import {Request, Response, Router} from 'express';
import services from './services';
import stubs from './stubs';
import sessions from './sessions';
import wrap from './wrapper';
import {documentationController, flushController, stubsController} from '../container';

let router = Router({mergeParams: true});

router.get('/', function (request: Request, response: Response): void {
    response.send('Techery proxy service');
});

router.delete('/api/stubs', wrap((req, res, next) => stubsController.removeAll(req, res)));
router.post('/api/flush', wrap(async (req, res, next) => flushController.flush(req, res)));
router.get('/api/documentation', wrap((req, res, next) => documentationController.show(req, res)));

router.use('/api/services', services);
router.use('/api/services', stubs);
router.use('/api/sessions', sessions);

export default router;
