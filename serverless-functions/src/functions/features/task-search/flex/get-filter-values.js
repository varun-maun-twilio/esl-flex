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

async function fetchElements(tempToken, elementLabelToUri) {
  return axios
    .post(
      `https://analytics.ytica.com/gdc/md/${process.env.YTICA_WORKSPACE_ID}/labels`,
      {
        elementLabelToUri,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: `GDCAuthTT=${tempToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { tempToken, filterObj } = event;
    console.error(typeof filterObj);
    console.error(filterObj);

    const filters = JSON.parse(filterObj);

    const elementLabelToUri = Object.keys(filters).map((k) => {
      return {
        labelUri: k,
        mode: 'EXACT',
        patterns: typeof filters[k] === 'string' ? [filters[k]] : filters[k],
      };
    });

    const filterValues = await fetchElements(tempToken, elementLabelToUri);
    const filterResponse = filterValues.elementLabelUri
      .map((o) => {
        return {
          key: o.labelUri,
          val: o.result.map((r) => r.elementLabels?.[0]?.uri || ''),
        };
      })
      .reduce((map, obj) => {
        map[obj.key] = obj.val;
        return map;
      }, {});

    response.setBody({ filterMap: filterResponse });
    return callback(null, response);
  } catch (searchError) {
    console.error(searchError);
    return handleError(searchError);
  }
});
