import { config as load } from 'dotenv';
import { env } from './helpers';
load();

const config: Config = Object.freeze({
    debug: env('DEBUG', false),
    app: {
        port: env('HERMET_API_PORT', 5000),
        base_url: env('HERMET_API_BASE_URL', 'http://localhost:5000/'),
        session_header: env('HERMET_SESSION_HEADER', 'x-session-id'),
        default_stub_ttl: env('HERMET_DEFAULT_STUB_TTL', 300),
        default_service_ttl: env('HERMET_DEFAULT_SERVICE_TTL', 0),
        default_session_ttl: env('HERMET_DEFAULT_SESSION_TTL', 0)
    },
    log: {
        app: env('LOG_API_FILE_NAME', 'logs/api.log'),
        proxy: env('LOG_PROXY_FILE_NAME', 'logs/proxy.log'),
        level: env('LOG_LEVEL', 'warn')
    },
    proxy: {
        port: env('HERMET_PROXY_PORT', 5050),
        timeout: env('PROXY_DEFAULT_TIMEOUT', 10000)
    },
    database: {
        file: 'database/db.json',
        autosave_interval: env('HERMET_DATABASE_AUTOSAVE_INTERVAL', 5000)
    },

    api: {
        documentation: 'documents/api.yml'
    }
});

class Config {
    public debug: boolean;

    public app: {
        port: number,
        base_url: string,
        session_header: string,
        default_stub_ttl: number,
        default_service_ttl: number
        default_session_ttl: number
    };

    public log: {
        app: string,
        proxy: string,
        level: string
    };

    public proxy: {
        timeout: number,
        port: number
    };

    public database: {
        file: string,
        autosave_interval: number
    };

    public api: {
        documentation: string
    };
}

export { config, Config };
export default config;
