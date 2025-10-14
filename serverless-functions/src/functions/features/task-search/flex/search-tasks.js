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

async function fetchReportLink(tempToken, filterMap) {
  let filterCriteria = {};
  if (filterMap !== null) {
    filterCriteria = {
      context: {
        filters: Object.keys(filterMap).map((k) => {
          return {
            uri: k,
            constraint: {
              type: 'list',
              elements: filterMap[k],
            },
          };
        }),
      },
    };
  }

  return axios
    .post(
      `https://analytics.ytica.com/gdc/app/projects/${process.env.YTICA_WORKSPACE_ID}/execute/raw`,
      {
        report_req: {
          report: `/gdc/md/${process.env.YTICA_WORKSPACE_ID}/obj/${process.env.YTICA_REPORT_ID}`,
          ...filterCriteria,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: `GDCAuthTT=${tempToken}`,
        },
      },
    )
    .then((response) => {
      return response.data.uri;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function downloadReport(tempToken, reportUri) {
  return axios
    .get(`https://analytics.ytica.com${reportUri}`, {
      headers: {
        Cookie: `GDCAuthTT=${tempToken}`,
      },
    })
    .then(async (response) => {
      console.error(response.status);
      if (response.status === 202) {
        return downloadReport(tempToken, reportUri);
      }
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { tempToken, filterMap: filterMapString } = event;
    const filterMap = JSON.parse(filterMapString);

    const reportLink = await fetchReportLink(tempToken, filterMap);

    const reportData = await downloadReport(tempToken, reportLink);

    const responseData = reportData.split('\r\n').map((r) => {
      return r.split('","').map((c) => c.replace(/"/g, ''));
    });
    responseData.shift();
    responseData.pop();
    const rows = responseData.map((o) => {
      return {
        date: o[0],
        time: o[1],
        channel: o[6],
        segment: o[2],
        customerContact: String(o[4]) + o[5],
        externalContact: o[3],
        conversationSid: o[7],
        direction: o[8],
      };
    });

    response.setBody({ rows });
    return callback(null, response);
  } catch (searchError) {
    console.error(searchError);
    return handleError(searchError);
  }
});
