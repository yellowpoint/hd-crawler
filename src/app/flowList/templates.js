export const templates = [
  {
    key: '图片解析',
    value: `{
  "nodes": [
    {
      "id": "0",
      "position": {
        "x": 0,
        "y": 0
      },
      "data": {
        "title": "上传图片",
        "status": "loading"
      },
      "type": "NodeImg"
    },
    {
      "id": "1",
      "position": {
        "x": 0,
        "y": 300
      },
      "data": {
        "title": "识别图片",
        "status": "waiting"
      },
      "type": "NodeKeyword"
    },
    {
      "id": "2",
      "position": {
        "x": 0,
        "y": 650
      },
      "data": {
        "title": "识图提取关键词"
      },
      "type": "NodeText"
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "0",
      "target": "1",
      "label": "0-1",
      "animated": true
    },
    {
      "id": "e2-3",
      "source": "1",
      "target": "2",
      "label": "1-2",
      "animated": true
    }
  ]
}`,
  },
];
