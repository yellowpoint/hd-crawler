import fs from 'fs';

// import { data } from './amazon_data.js';
const data = JSON.parse(fs.readFileSync('./storage/output-1.json', 'utf8'));
// console.log('data', data);
function buildTree2(data) {
  const tree = {};

  // First, initialize all root nodes
  for (const id in data) {
    if (!tree[id]) {
      tree[id] = { id, ...data[id] };
    }
    // Create a place for children
    tree[id].children = tree[id].children || [];
  }

  // Next, iterate again to connect children to their parents
  for (const id in data) {
    const item = data[id];
    if (item.children) {
      item.children.forEach((child) => {
        // Make sure the child exists in tree
        if (!tree[child.id]) {
          tree[child.id] = { id: child.id, name: child.name, children: [] };
        }
        // Push child to its parent
        tree[id].children.push(tree[child.id]);
      });
    }
  }

  // Finally, extract the roots (those that are not children of any node)
  const roots = Object.values(tree).filter((node) => {
    return !Object.values(tree).some((parent) =>
      parent.children.some((child) => child.id === node.id),
    );
  });

  return roots;
}
function buildTree3(data) {
  const processedNodes = new Set();

  function processNode(id) {
    if (processedNodes.has(id)) return null;

    const node = data[id];
    if (!node) return null;

    processedNodes.add(id);

    if (node.children) {
      node.children = node.children
        .map((child) => processNode(child.id))
        .filter((child) => child !== null);
    }

    return { id, ...node };
  }

  const tree = [];
  for (const id in data) {
    if (!processedNodes.has(id)) {
      const rootNode = processNode(id);
      if (rootNode) tree.push(rootNode);
    }
  }

  return tree;
}
function buildTree(data) {
  // 生成根节点的列表
  const tree = Object.keys(data).map((id) => ({
    id,
    ...data[id],
    // name: data[id].name,
    children: data[id].children || [],
  }));

  // 构建父子关系
  const idMap = Object.fromEntries(tree.map((node) => [node.id, node]));
  tree.forEach((node) => {
    node.children.forEach((child) => {
      if (idMap[child.id]) {
        // child.childrenCount = idMap[child.id].childrenCount;
        // child.childrenName = idMap[child.id].childrenName;
        // child.children = idMap[child.id].children;
        Object.assign(child, idMap[child.id]);
      }
    });
  });

  // 找到根节点（没有其他节点引用的节点）
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
      categoryMap[categoryId].childrenName = children.map(
        (child) => child.name + '(' + child.id + ')',
      );
      categoryMap[categoryId].children = children;
    }
  });

  return categoryMap;
}
const categoryMap = transToCategoryTree(data);
const categoryTree = buildTree(categoryMap);
const categoryLevels = countNodesByLevel(categoryTree);

fs.writeFile(
  'categoryLevels.json',
  JSON.stringify(categoryLevels, null, 2),
  'utf8',
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('JSON data is saved.');
  },
);

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

fs.writeFile(
  'categoryMap.json',
  JSON.stringify(categoryMap, null, 2),
  'utf8',
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('JSON data is saved.');
  },
);
