const { prepareStudioFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const { emailAddresses } = require(Runtime.getAssets()['/features/esl-email-config.js'].path);

const requiredParameters = [
  { key: 'conversationSid', purpose: 'conversationSid for email conversation' },
  { key: 'messageSid', purpose: 'conversation message sid for email' },
  { key: 'to', purpose: 'to address where the email has reached flex' },
  { key: 'from', purpose: 'from address where the email has reached flex' },
];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { conversationSid, messageSid, to, from } = event;

    const client = context.getTwilioClient();

    await client.conversations.v1
      .conversations(conversationSid)
      .messages(messageSid)
      .update({
        attributes: JSON.stringify({
          direction: 'inbound',
          from: [from],
          to: [to],
        }),
      });

    response.setStatusCode(200);
    response.setBody({ message: 'ok' });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
