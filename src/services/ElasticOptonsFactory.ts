import IndexDocumentParams = Elasticsearch.IndexDocumentParams;
import GetParams = Elasticsearch.GetParams;
import UpdateDocumentParams = Elasticsearch.UpdateDocumentParams;
import DeleteDocumentParams = Elasticsearch.DeleteDocumentParams;
import SearchParams = Elasticsearch.SearchParams;
import DeleteDocumentByQueryParams = Elasticsearch.DeleteDocumentByQueryParams;

export default class ElasticOptionsFactory {

    protected index: string;

    /**
     * @param {string} index
     */
    constructor(index: string) {
        this.index = index;
    }

    /**
     * @param {string} type
     * @param {Object} data
     *
     * @returns {IndexDocumentParams<any>}
     */
    public getIndexParams(type: string, data: any): IndexDocumentParams<any> {
        return {
                index: this.index,
                type: type,
                body: data,
                refresh: 'true'
            } as IndexDocumentParams<any>;
    }

    /**
     * @param {string} type
     * @param {string} id
     *
     * @returns {GetParams}
     */
    public getGetParams(type: string, id: string): GetParams {
        return {
                index: this.index,
                type: type,
                id: id
            } as GetParams;
    }

    /**
     * @param {string} type
     * @param {string} id
     * @param {Object} data
     *
     * @returns {UpdateDocumentParams}
     */
    public getUpdateParams(type: string, id: string, data: any): UpdateDocumentParams {
        return {
            index: this.index,
            type: type,
            id: id,
            refresh: true,
            body: {
                doc: data
            }
        } as UpdateDocumentParams;
    }

    /**
     * @param {string} type
     * @param {string} id
     *
     * @returns {DeleteDocumentParams}
     */
    public getDeleteParams(type: string, id: string): DeleteDocumentParams {
        return {
            index: this.index,
            type: type,
            id: id
        } as DeleteDocumentParams;
    }

    /**
     * @param {string} type
     *
     * @returns {SearchParams}
     */
    public getSearchParams(type: string): SearchParams {
        return {
            index: this.index,
            type: type
        } as SearchParams;
    }

    /**
     * @param {string} type
     *
     * @returns {any}
     */
    public getDeleteByQueryParams(type: string): any {
        return {
            index: this.index,
            type: type,
            conflicts: 'proceed'
        };
    }
}
