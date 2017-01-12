import {Router, Request, Response} from 'express';
import services from './services';
import stubs from './stubs';
import sessions from './sessions';
import groupStub from './groupStub';

let router = Router({mergeParams: true});

router.get('/', function (request: Request, response: Response): void {
    response.send('Techery proxy service');
});

router.use('/api/services', services);
router.use('/api/services', stubs);
router.use('/api/stubs', groupStub);
router.use('/api/sessions', sessions);

export default router;
