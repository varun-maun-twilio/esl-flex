const { prepareStudioFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const axios = require('axios');

const requiredParameters = [{ key: 'to', purpose: 'to address where the email has reached flex' }];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { to } = event;

    const emailAddresses = (await axios.get(`${process.env.COMMON_CONFIG_DOMAIN}/esl-email-config.json`)).data;

    const toLookup = emailAddresses.filter((o) => o.twilioEmailAddress === to)?.[0]?.realEmailAddress || to;

    response.setStatusCode(200);
    response.setBody({ to: toLookup });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
