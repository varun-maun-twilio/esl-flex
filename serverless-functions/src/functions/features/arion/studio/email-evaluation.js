const { prepareStudioFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const axios = require('axios');

const requiredParameters = [];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { emailSubject, emailBody, emailFrom, emailTo, engagementID, attachments } = event;

    const params = new URLSearchParams();
    params.append('emailSubject', emailSubject);
    params.append('emailBody', emailBody);
    params.append('emailFrom', emailFrom);
    params.append('emailTo', emailTo);
    params.append('engagementID', engagementID);
    params.append('emailAttachments', attachments);
    console.log('email-evaluation: params: ', params);

    const result = await axios.post(
      process.env.ARION_EVALUATION_URL,
      params,
      {
        auth: {
          username: process.env.ARION_USERNAME,
          password: process.env.ARION_PASSWORD,
        },
      },
    );

    const { liveAgent, replyContent } = result.data;

    response.setStatusCode(result.status);
    response.setBody({ liveAgent, replyContent });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
