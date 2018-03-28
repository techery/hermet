import * as express from 'express';
import {NextFunction, Request, Response} from 'express';
import routes from './routes/routes';
import {appHandler as errorHandler, proxyController} from './container';
import * as parser from 'body-parser';

const app = express();

app.use((req, res, next) => proxyController.proxy(req, res, next));

app.use(parser.json());
app.use(parser.urlencoded({extended: false}));

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
