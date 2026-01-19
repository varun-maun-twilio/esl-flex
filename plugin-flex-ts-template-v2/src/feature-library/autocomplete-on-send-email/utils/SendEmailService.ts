import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import logger from '../../../utils/logger';
import {SendEmailRequest} from "../types/SendEmailTypes";


class SendEmailService extends ApiService {
 
  sendEmail = async (sendEmailRequest:SendEmailRequest): Promise<any> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      ...sendEmailRequest,
    };

    const bodyObj = new URLSearchParams();
    for( let oKey of  Object.keys(encodedParams)){
        bodyObj.append(oKey, encodedParams[oKey] + "");
    }

    try {
      return await this.fetchJsonWithReject<any>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/send-email/flex/send-to-smtp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: bodyObj
        },
      );
    } catch (error: any) {
      logger.error('[SendEmailService] Error sendEmail', error);
      throw error;
    }
  };

 

  
}

export default new SendEmailService();
