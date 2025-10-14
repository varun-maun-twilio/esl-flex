import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import logger from '../../../utils/logger';



class TaskSearchService extends ApiService {
 
  fetchToken = async (): Promise<any> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
    };
    try {
      return await this.fetchJsonWithReject<any>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/task-search/flex/get-insights-token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
    } catch (error: any) {
      logger.error('[TaskSearchService] Error fetchToken', error);
      throw error;
    }
  };

  getFilterIdentifiers = async (insightsToken:string): Promise<any> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      tempToken:insightsToken,
    };
    try {
      return await this.fetchJsonWithReject<any>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/task-search/flex/get-filter-identifiers`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
    } catch (error: any) {
      logger.error('[TaskSearchService] Error getFilterIdentifiers', error);
      throw error;
    }
  };

  getFilterValues = async (insightsToken:string,filterObj:any): Promise<any> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      tempToken:insightsToken,
      filterObj:JSON.stringify(filterObj)
    };
    try {
      return await this.fetchJsonWithReject<any>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/task-search/flex/get-filter-values`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
    } catch (error: any) {
      logger.error('[TaskSearchService] Error getFilterIdentifiers', error);
      throw error;
    }
  };

  

  searchTasks = async (insightsToken:string,filterMap:any): Promise<any> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      filterMap:JSON.stringify(filterMap), 
      tempToken:insightsToken,
    };
    try {
      return await this.fetchJsonWithReject<any>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/task-search/flex/search-tasks`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
    } catch (error: any) {
      logger.error('[TaskSearchService] Error searchTasks', error);
      throw error;
    }
  };


  

  
}

export default new TaskSearchService();
