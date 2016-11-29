let stub = require('../models/stub');
let BaseRepository = require('./BaseRepository');

class StubsRepository extends BaseRepository {}

module.exports = new StubsRepository(stub);