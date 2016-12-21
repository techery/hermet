
export default class SessionsRepository {
  protected elasticClient: any;

  /**
   * @param {elasticClient} elasticClient
   */
  constructor(elasticClient: any) {
    super();
    this.elasticClient = elasticClient;
  }
}