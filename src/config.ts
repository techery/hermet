import {config as load} from 'dotenv';
import {env} from './helpers';

load();

const config: Config = Object.freeze({
    debug: env('DEBUG', false),

    app: {
        port: env('HERMET_API_PORT', 5025),
        base_url: env('HERMET_API_BASE_URL', 'http://localhost'),
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
        timeout: env('PROXY_DEFAULT_TIMEOUT', 10000)
    },

    database: {
        file: 'database/db.json',
        autosave_interval: env('HERMET_DATABASE_AUTOSAVE_INTERVAL', 5000)
    },

    api: {
        documentation: 'documents/api.yml',
        swagger: 'documents/swagger/swagger.html'
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
        timeout: number
    };

    public database: {
        file: string,
        autosave_interval: number
    };

    public api: {
        documentation: string,
        swagger: string
    };
}

export {config, Config};
export default config;
