import {Request, Response, NextFunction} from 'express';
import routes from './routes/routes';
import * as parser from 'body-parser';
import * as express from 'express';
import {appLogger as logger, appHandler as errorHandler} from './container';
import sessionMiddleware from './middleware/session';

const app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended: false}));
app.use(sessionMiddleware);

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (request: Request, response: Response): void {
    response.status(404).json({error: 'Not Found'});
});

// error handler
app.use(function (err: any, request: Request, response: Response, next: NextFunction): any {
    errorHandler.handle(err, request, response);
    next();
});

export default app;
