import { GoogleAdsApi, enums, parse } from 'google-ads-api';
import 'dotenv/config';

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
  login_customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

const reportOptions = {
  entity: 'ad_group_criterion',
  attributes: ['ad_group_criterion.keyword.text', 'ad_group_criterion.status'],
  constraints: {
    'ad_group_criterion.type': enums.CriterionType.KEYWORD,
  },
};

const stream = await customer.reportStreamRaw(reportOptions);
// console.log('stream', stream);
// Rows are streamed in 10,000 row chunks
stream.on('data', (chunk) => {
  console.log('chunk', chunk);
  const parsedResults = parse({
    results: chunk.results,
    reportOptions,
  });
  console.log('parsedResults', parsedResults);
});

stream.on('error', (error) => {
  throw new Error(error);
});

stream.on('end', () => {
  console.log('stream has finished');
});
