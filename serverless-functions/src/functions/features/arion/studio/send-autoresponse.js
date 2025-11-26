const { prepareStudioFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const nodemailer = require('nodemailer');
const axios = require('axios');

const requiredParameters = [];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const emailAddresses = (await axios.get(`${process.env.COMMON_CONFIG_DOMAIN}/esl-email-config.json`)).data;
  try {
    const { from, to, cc, subject, body } = event;
    const identifiedConfig = emailAddresses.filter((ed) => ed.realEmailAddress === from)?.[0];

    if (identifiedConfig === null) {
      return handleError(new Error('from address incorrect'));
    }
    const SMTP_HOST = identifiedConfig.smtpHost;
    const SMTP_PORT = identifiedConfig.smtpPort;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
    });

    const emailInfo = await transporter.sendMail({
      from,
      to,
      subject,
      html: body,
    });

    response.setBody({ message: 'success', emailInfo });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
