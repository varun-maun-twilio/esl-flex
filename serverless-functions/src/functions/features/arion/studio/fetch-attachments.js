const { prepareStudioFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const axios = require('axios');

const requiredParameters = [];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { attachments, conversationServiceSid } = event;

    let mediaList = [];
    try {
      const mediaFiles = JSON.parse(attachments).filter(s => s.category === "media");
      for (let mediaFile of mediaFiles) {
        const mediaResponse = await axios.get(
          `https://mcs.us1.twilio.com/v1/Services/${conversationServiceSid}/Media/${mediaFile.sid}`, {
          auth: {
            username: context.ACCOUNT_SID,
            password: context.AUTH_TOKEN
          }

        });
        if (mediaResponse?.data?.links?.content_direct_temporary) {
          mediaList.push(
            {
              "size":mediaFile.size,
              "name":mediaFile.filename,
              "id":mediaFile.sid,
              "additionalProperties":{},
              "contentType":mediaFile.content_type,
              "url":encodeURI(mediaResponse?.data?.links?.content_direct_temporary)
            })
            
          }
      }

    } catch (e) { }

    console.log('fetch-attachments: mediaList: ', mediaList);

    response.setStatusCode(200);
    response.setBody({ mediaList });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
