const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const { emailAddresses } = require(Runtime.getAssets()['/features/esl-email-config.js'].path);

const requiredParameters = [];
exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    response.setBody(
      emailAddresses.map((o) => {
        return {
          label: o.originalTarget,
          value: o.twilioEmail,
          queueSid: o.outboundQueueSid,
        };
      }),
    );
    return callback(null, response);
  } catch (searchError) {
    console.error(searchError);
    return handleError(searchError);
  }
});
