const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const axios = require('axios');

const requiredParameters = [
  {
    key: 'tempToken',
    purpose: 'Good Data Temporary Token',
  },
];

async function fetchIdentifiers(tempToken) {
  return axios
    .post(
      `https://analytics.ytica.com/gdc/md/${process.env.YTICA_WORKSPACE_ID}/identifiers`,
      {
        identifierToUri: [
          'label.conversations.communication_channel',
          'label.customers.email_label',
          'label.conversations.external_contact',
          'date.date.yyyymmdd',
          'label.customers.phone_label',
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: `GDCAuthTT=${tempToken}`,
        },
      },
    )
    .then((response) => {
      return response.data.identifiers;
    })
    .catch((error) => {
      console.log(error);
    });
}

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { tempToken } = event;

    const filterIdentifiers = await fetchIdentifiers(tempToken);

    response.setBody({ filterIdentifiers });
    return callback(null, response);
  } catch (searchError) {
    console.error(searchError);
    return handleError(searchError);
  }
});
