const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const axios = require('axios');

const requiredParameters = [];
exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const { flexUserSid } = event;
  const client = context.getTwilioClient();

  const emailAddresses = (await axios.get(`${process.env.COMMON_CONFIG_DOMAIN}/esl-email-config.json`)).data;

  const flexUserResponse = await axios.get(
    `https://flex-api.twilio.com/v4/Instances/${process.env.FLEX_INSTANCE_SID}/Users/${flexUserSid}`,
    {
      auth: {
        username: process.env.ACCOUNT_SID,
        password: process.env.AUTH_TOKEN,
      },
    },
  );

  if (!flexUserResponse.data) {
    console.error('flexUserResponse.data', flexUserResponse.data);
    return handleError(new Error('data not found'));
  }

  const { flex_team_sid } = flexUserResponse.data;
  let flexTeamName = null;
  if (flex_team_sid) {
    const flexTeamResponse = await axios.get(
      `https://flex-api.twilio.com/v1/Instances/${process.env.FLEX_INSTANCE_SID}/Teams/${flex_team_sid}`,
      {
        auth: {
          username: process.env.ACCOUNT_SID,
          password: process.env.AUTH_TOKEN,
        },
      },
    );

    if (flexTeamResponse.data) {
      flexTeamName = flexTeamResponse.data?.friendly_name;
    }
  }
  console.error('flexTeamName', flexTeamName);

  try {
    response.setBody(
      emailAddresses
        .filter((o) => {
          return (flexTeamName === 'default' && o.managementTeam === '') || flexTeamName === o.managementTeam;
        })
        .map((o) => {
          return {
            label: o.realEmailAddress,
            value: o.twilioEmailAddress,
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
