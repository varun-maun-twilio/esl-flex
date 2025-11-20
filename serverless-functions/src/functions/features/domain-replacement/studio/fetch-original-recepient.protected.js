const { prepareStudioFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const { emailAddresses } = require(Runtime.getAssets()['/features/esl-email-config.js'].path);

const requiredParameters = [{ key: 'to', purpose: 'to address where the email has reached flex' }];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { to } = event;

    const toLookup = emailAddresses.filter((o) => o.twilioEmail === to)?.[0]?.originalTarget || to;

    response.setStatusCode(200);
    response.setBody({ to: toLookup });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
