import {Request, Response} from 'express';

let express = require('express');
let router = new express.Router();

/* GET home page. */
router.get('/', function (request: Request, response: Response): void {
  response.send('Techery proxy service');
});

module.exports = router;
