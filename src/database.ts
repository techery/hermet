import { Mongoose } from 'mongoose';
import config from './config';

const mongoose = new Mongoose();

mongoose.connect(config.database.uri, {
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500
});

mongoose.connection.on('error', (err) => {
    if (err.message.indexOf('ECONNREFUSED') !== -1) {
        console.error("Error: The server was not able to reach MongoDB.\nMaybe it's not running?");
        process.exit(1);
    } else {
        throw err;
    }
});

export default mongoose;
