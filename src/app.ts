import NotFound from './controllers/errors/NotFound';
import {Request, Response, NextFunction} from 'express';

let express = require('express');
let logger = require('./components/logger').apiLogger;
let bodyParser = require('body-parser');

let index = require('./routes/index');
let routes = require('./routes/all');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(index);
app.use('/api', routes);
// catch 404 and forward to error handler
app.use(function (request: Request, response: Response): void {
    response.status(404).json({error: 'Not Found'});
});

// error handler
app.use(function (err: Error, request: Request, response: Response, next: NextFunction): void {
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
