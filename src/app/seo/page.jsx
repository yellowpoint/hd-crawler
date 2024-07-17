import { Link } from 'react-router-dom';

import { Card, Divider } from 'antd';

const categoryCards = [
  {
    name: '关键词优化',
    cards: [
      {
        title: 'Google关键词搜索',
        content: 'Google关键词搜索',
        path: '/google',
      },
      {
        title: '亚马逊关键词搜索',
        content: '亚马逊关键词搜索',
        path: '/google',
      },
      {
        title: 'Google关键词搜索',
        content: 'Google关键词搜索',
        path: '/google',
      },
      {
        title: '亚马逊关键词搜索',
        content: '亚马逊关键词搜索',
        path: '/google',
      },
    ],
  },
  {
    name: '文章优化',
    cards: [
      {
        title: 'SEO推荐文章',
        content: 'SEO推荐文章',
        path: '/seo/article',
      },
      {
        title: '文章优化',
        content: '文章优化',
        path: '/seo/article',
      },
    ],
  },
];

const Seo = () => {
  return (
    <div>
      {categoryCards.map((category, index) => (
        <div key={index}>
          <h2 className="my-16 text-22 font-bold">{category.name}</h2>
          <div className="flex flex-wrap gap-16">
            {category.cards.map((card, index) => (
              <Link to={card.path} key={index}>
                <Card
                  className="w-300"
                  title={card.title}
                  bordered={false}
                  hoverable
                >
                  {card.content}
                </Card>
              </Link>
            ))}
          </div>
          <Divider />
        </div>
      ))}
    </div>
  );
};

export default Seo;
