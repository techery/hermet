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
     * @param {string} parentId
     *
     * @returns {IndexDocumentParams<any>}
     */
    public getIndexParams(type: string, data: any, parentId: string): IndexDocumentParams<any> {
        let options: IndexDocumentParams<any> = {
                index: this.index,
                type: type,
                body: data,
                refresh: 'true'
            } as IndexDocumentParams<any>;

        if (parentId) {
            options.parent = parentId;
        }

        return options;
    }

    /**
     * @param {string} type
     * @param {string} id
     * @param {string} parentId
     *
     * @returns {GetParams}
     */
    public getGetParams(type: string, id: string, parentId: string): GetParams {
        let options: GetParams = {
                index: this.index,
                type: type,
                id: id
            };

        if (parentId) {
            options.parent = parentId;
        }

        return options;
    }

    /**
     * @param {string} type
     * @param {string} id
     * @param {Object} data
     * @param {string} parentId
     *
     * @returns {UpdateDocumentParams}
     */
    public getUpdateParams(type: string, id: string, data: any, parentId: string): UpdateDocumentParams {
        let options: UpdateDocumentParams = {
            index: this.index,
            type: type,
            id: id,
            refresh: true,
            body: {
                doc: data
            }
        };

        if (parentId) {
            options.parent = parentId;
        }

        return options;
    }

    /**
     * @param {string} type
     * @param {string} id
     * @param {string} parentId
     *
     * @returns {DeleteDocumentParams}
     */
    public getDeleteParams(type: string, id: string, parentId: string): DeleteDocumentParams {
        let options: DeleteDocumentParams = {
            index: this.index,
            type: type,
            id: id
        };

        if (parentId) {
            options.parent = parentId;
        }

        return options;
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
