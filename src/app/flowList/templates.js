export const templates = [
  {
    key: '图片解析',
    value:
      '{"nodes":[{"id":"img","position":{"x":0,"y":0},"data":{"title":"商品图"},"type":"NodeImg"},{"id":"keyword","position":{"x":0,"y":400},"data":{"title":"关键词"},"type":"NodeKeyword"},{"id":"text","position":{"x":0,"y":600},"data":{"title":"分析结果"},"type":"NodeText"}],"edges":[{"id":"e1-2","source":"img","target":"keyword","label":"1-2","animated":true},{"id":"e2-3","source":"keyword","target":"text","label":"1-2","animated":true}],"data":{"img":{"status":"loading"},"keyword":{},"text":{}}}',
  },
];
