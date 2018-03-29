import { ServerResponse } from 'http';

export interface ProxyServerResponse extends ServerResponse {
    headers: any;
    body: any;
}
