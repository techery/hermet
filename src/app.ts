import NotFound from './controllers/errors/NotFound';
import {Request, Response, NextFunction} from 'express';
import routes from './routes/routes';
import * as parser from 'body-parser';
import * as express from 'express';

let logger = require('./components/logger').apiLogger;

const app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended: false}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (request: Request, response: Response): void {
    response.status(404).json({error: 'Not Found'});
});

// error handler
app.use(function (err: any, request: Request, response: Response, next: NextFunction): any {
    logger.error('Request: ' + logger.curlify(request, request.body || null) + '\r\n' + err.stack);
    if (err instanceof NotFound) {
        response.status(404).json({error: err.name + ': ' + err.message});
    } else if (err instanceof Error) {
        response.status(500).json({error: err.name + ': ' + err.message});
    } else {
        response.status(500).json({error: 'Hermet API error.'});
    }

    next();
});

module.exports = app;
