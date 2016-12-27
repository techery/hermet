import TimeSpan = Elasticsearch.TimeSpan;

export interface SessionInterface {
    id: string;
    name?: string;
    expireAt: string;
    ttl?: number;
}
