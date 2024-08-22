import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./storage/output-1.json', 'utf8'));

function buildTree(data) {
  let keyCounter = 0;

  // Helper function to generate a unique key for each node
  const generateUniqueKey = () => `node_${keyCounter++}`;

  // Recursive function to build the tree and assign keys
  function buildNode(id, nodeData) {
    const node = {
      key: generateUniqueKey(),
      id,
      ...nodeData,
    };

    if (node.children) {
      node.children = node.children.map((child) => {
        const existingNode = data[child.id];
        if (existingNode) {
          return buildNode(child.id, existingNode);
        } else {
          return {
            key: generateUniqueKey(),
            id: child.id,
            ...child,
          };
        }
      });
    }

    return node;
  }

  // Building the initial tree structure
  const tree = Object.keys(data).map((id) => buildNode(id, data[id]));

  // Filter out nodes that are not root nodes
  const rootNodes = tree.filter((node) => {
    return !Object.values(data).some((d) => {
      return d.children && d.children.some((child) => child.id === node.id);
    });
  });

  return rootNodes;
}

function countNodesByLevel(tree) {
  const levels = [];

  function traverse(node, depth) {
    if (!levels[depth]) {
      levels[depth] = [];
    }
    levels[depth].push(node.name);

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => traverse(child, depth + 1));
    }
  }

  tree.forEach((rootNode) => traverse(rootNode, 0));

  return levels.map((nodes, index) => ({
    level: index + 1,
    count: nodes.length,
    nodes: nodes,
  }));
}

/**
 * 将数据转化为树状结构的类目数据
 * @param {Array} rawData 原始数据
 * @returns {Object} 树状结构的类目数据
 */
function transToCategoryTree(rawData) {
  const categoryMap = {};

  rawData.forEach((item) => {
    const url = item.url;
    const title = item.title;
    const content = item.content;
    const categoryId = url.match(/\d+(?=\.html)/)[0];
    const categoryName = content.match(
      /Browse Nodes\s*\n\s*\n([^\n]+)\n\nBrowse node/,
    )?.[1];

    const children = [...content.matchAll(/\d+\t([^\t]+)\t(\d+)\tBrowse/g)].map(
      (match) => ({ name: match[1], id: match[2] }),
    );

    categoryMap[categoryId] = {
      name: categoryName,
      id: categoryId,
    };
    if (children.length > 0) {
      categoryMap[categoryId].childrenCount = children.length;
      // categoryMap[categoryId].childrenName = children.map(
      //   (child) => child.name + '(' + child.id + ')',
      // );
      categoryMap[categoryId].children = children;
    }
  });

  return categoryMap;
}
const categoryMap = transToCategoryTree(data);
const categoryTree = buildTree(categoryMap);
const categoryLevels = countNodesByLevel(categoryTree);
// fs.writeFile(
//   'categoryMap.json',
//   JSON.stringify(categoryMap, null, 2),
//   'utf8',
//   (err) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log('JSON data is saved.');
//   },
// );

// fs.writeFile(
//   'categoryLevels.json',
//   JSON.stringify(categoryLevels, null, 2),
//   'utf8',
//   (err) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log('JSON data is saved.');
//   },
// );

fs.writeFile(
  'categoryTree.json',
  JSON.stringify(categoryTree, null, 2),
  'utf8',
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('JSON data is saved.');
  },
);
