const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const axios = require('axios');

const requiredParameters = [];

async function fetchInsightsSuperToken() {
  return axios
    .post(
      'https://analytics.ytica.com/gdc/account/login',
      {
        postUserLogin: {
          login: process.env.YTICA_USERNAME,
          password: process.env.YTICA_PASSWORD,
          remember: 0,
          verify_level: 2,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((response) => {
      return response.data.userLogin.token;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function fetchInsightsTempToken(superToken) {
  return axios
    .get('https://analytics.ytica.com/gdc/account/token', {
      headers: {
        'Content-Type': 'application/json',
        'X-GDC-AuthSST': superToken,
      },
    })
    .then((response) => {
      return response.data.userToken.token;
    })
    .catch((error) => {
      console.log(error);
    });
}

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const superToken = await fetchInsightsSuperToken();
    const tempToken = await fetchInsightsTempToken(superToken);
    response.setBody({ message: 'success', tempToken });
    return callback(null, response);
  } catch (fetchTokenError) {
    return handleError(fetchTokenError);
  }
});
