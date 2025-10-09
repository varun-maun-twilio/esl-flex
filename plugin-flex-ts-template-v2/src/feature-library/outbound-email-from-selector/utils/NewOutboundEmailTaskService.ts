import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import logger from '../../../utils/logger';



class NewOutboundEmailTaskService extends ApiService {
 
  fetchEmailList = async (): Promise<any> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token)
    };
    try {
      return await this.fetchJsonWithReject<any>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/outbound-email-from-selector/flex/fetch-email-list`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
    } catch (error: any) {
      logger.error('[NewOutboundEmailTaskService] Error fetchEmailList', error);
      throw error;
    }
  };

  fetchQueues = async (): Promise<any> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token)
    };
    try {
      return await this.fetchJsonWithReject<any>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/taskrouter/get-queues`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
    } catch (error: any) {
      logger.error('[NewOutboundEmailTaskService] Error getQueues', error);
      throw error;
    }
  };

  
}

export default new NewOutboundEmailTaskService();
