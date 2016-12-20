import { config as load } from 'dotenv';
import { env } from './helpers';
load();

const config: Config = Object.freeze({
    app: {
        hermet_api_port: env('HERMET_API_PORT', 5000),
        hermet_proxy_port: env('HERMET_PROXY_PORT', 5050),
        hermet_api_base_url: env('HERMET_API_BASE_URL', 'http://localhost:5000/api'),
        hermet_session_header: env('HERMET_SESSION_HEADER', 'x-session-id')
    },
    log: {
        apiFileName: env('LOG_API_FILE_NAME', 'api.log'),
        proxyFileName: env('LOG_PROXY_FILE_NAME', 'proxy.log'),
        logLevel: env('LOG_LEVEL', 'debug')
    },
    proxy: {
        defaultTimeout: env('PROXY_DEFAULT_TIMEOUT', 10000)
    },
    elasticsearch: {
        index: env('ELASTIC_INDEX', 'hermet')
    }
});

class Config {
    public app: {
        hermet_api_port: number,
        hermet_proxy_port: number,
        hermet_api_base_url: string,
        hermet_session_header: string
    };

    public log: {
        apiFileName: string,
        proxyFileName: string,
        logLevel: string
    };

    public proxy: {
        defaultTimeout: number
    };

    public elasticsearch: {
        index: string
    };
}

export { config, Config };
export default config;
