import { GoogleAdsApi } from 'google-ads-api';

const client = new GoogleAdsApi({
  client_id:
    '12955740908-gr0nbhm6gfhmdeuti0h53pi1i4e78n9q.apps.googleusercontent.com',
  client_secret: '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',
  developer_token: 'tE_jQ--5iockvUjYqCYe_w',
});

const customer = client.Customer({
  customer_id: '2507699917',
  refresh_token:
    '1//0gPXs-DAtWRMICgYIARAAGBASNwF-L9IrIcuuAl1WR-T40QwlR__WPQvDmtPyBRtTET2i4wdtiirIETE6CRvj5WygCa8sATH1V_o', // 替换为新获取的 refresh_token
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
