import wrap from './wrapper';
import {sessionController} from '../container';

let express = require('express');
let router = new express.Router();

router.route('/')
  .get(wrap(async (req, res, next) => sessionController.list(req, res)))
  .post(wrap(async (req, res, next) => sessionController.create(req, res)));

router.route('/:sessionId')
  .get(wrap(async (req, res, next) => sessionController.get(req, res)))
  .put(wrap(async (req, res, next) => sessionController.update(req, res)))
  .delete(wrap(async (req, res, next) => sessionController.remove(req, res)));

module.exports = router;
