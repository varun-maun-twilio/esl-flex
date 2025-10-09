const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const { emailAddresses } = require(Runtime.getAssets()['/features/esl-email-config.js'].path);

const nodemailer = require('nodemailer');
const axios = require('axios');

const requiredParameters = [
  {
    key: 'to',
    purpose: 'to addresses for email',
  },
  {
    key: 'from',
    purpose: 'from addresses for email',
  },
  {
    key: 'subject',
    purpose: 'subject for email',
  },
  {
    key: 'body',
    purpose: 'body for email',
  },
  {
    key: 'conversationSid',
    purpose: 'conversationSid for email',
  },
  {
    key: 'conversationMessageSid',
    purpose: 'conversationMessageSid for the message added to conversation without to/cc',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { from: twilioFrom, to, cc, subject, body, conversationSid, conversationMessageSid } = event;
    const identifiedConfig = emailAddresses.filter((ed) => ed.twilioEmail === twilioFrom)?.[0];

    if (identifiedConfig === null) {
      return handleError(new Error('from address incorrect'));
    }
    const originalFrom = identifiedConfig.originalTarget;
    const twilioClient = context.getTwilioClient();

    const conversationMessage = await twilioClient.conversations.v1
      .conversations(conversationSid)
      .messages(conversationMessageSid)
      .fetch();

    const emailAttachments = [];
    const conversationMessageMedia = conversationMessage.media;
    if (conversationMessageMedia !== null && conversationMessageMedia.length > 0) {
      const messageMedia = conversationMessageMedia.filter((m) => m.category === 'media');
      for (const messageMediaObj of messageMedia) {
        // Fetch Media Link
        // Fetch Media resource
        const mediaResponse = await axios.get(
          `https://mcs.us1.twilio.com/v1/Services/${context.TWILIO_FLEX_CHAT_SERVICE_SID}/Media/${messageMediaObj.sid}`,
          {
            auth: {
              username: context.ACCOUNT_SID,
              password: context.AUTH_TOKEN,
            },
          },
        );
        if (mediaResponse?.data?.links?.content_direct_temporary) {
          response.setStatusCode(200);
          emailAttachments.push({
            filename: messageMediaObj.filename,
            href: mediaResponse?.data?.links?.content_direct_temporary,
          });
        }
      }
    }

    await nodemailer.createTestAccount(async (err, account) => {
      if (err) {
        console.error(`Failed to create a testing account. ${err.message}`);
        return;
      }

      // 1️⃣  Configure a transporter that talks to Ethereal
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: account.user, // generated user
          pass: account.pass, // generated password
        },
      });

      // 2️⃣  Send a message
      const messageInfo = await transporter
        .sendMail({
          from: originalFrom,
          to,
          subject,
          html: body,
          attachments: emailAttachments,
        })
        .catch(console.error);
      console.error(nodemailer.getTestMessageUrl(messageInfo));

      response.setBody({ message: 'success', preview: nodemailer.getTestMessageUrl(messageInfo) });
    });
    return callback(null, response);
  } catch (searchError) {
    console.error(searchError);
    return handleError(searchError);
  }
});
