import { GoogleAdsApi } from 'google-ads-api';

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

async function getKeywordPlannerData(keyword) {
  try {
    const response = await customer.report({
      entity: 'keyword_view',
      attributes: [
        'keyword_view.resource_name',
        'keyword_view.keyword.text',
        'keyword_plan_keyword.keyword',
      ],
      metrics: [
        'keyword_view.average_cpc',
        'keyword_view.search_volume',
        'keyword_view.competition',
      ],
      constraints: {
        'keyword_view.keyword.text': keyword,
      },
    });

    console.log('API Response:', JSON.stringify(response, null, 2));

    const ideas = response.map((idea) => ({
      keyword: idea.keyword_view.keyword.text,
      searchVolume: idea.metrics.search_volume,
      competition: idea.keyword_view.competition,
      avgCPC: idea.metrics.average_cpc / 1000000, // Convert micros to actual currency
    }));

    return ideas;
  } catch (error) {
    console.error('获取关键词规划器数据时出错:', error);
    throw error;
  }
}

export { getKeywordPlannerData };
