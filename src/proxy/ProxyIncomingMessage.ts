import {IncomingMessage} from 'http';

export interface ProxyIncomingMessage extends IncomingMessage {
    body: any;
}
