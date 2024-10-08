import React, { useMemo, useState } from 'react';

import { Input, Tree } from 'antd';
import { debounce } from 'lodash';

import defaultData from '@/assets/amazon/Home&Kitchen.json';

const { Search } = Input;

const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, name } = node;
    dataList.push({
      key,
      name: name.toLowerCase(),
    });
    if (node.children) {
      generateList(node.children);
    }
  }
};

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
function searchNodes(nodes, keyword) {
  const lowerCaseKeyword = keyword.toLowerCase();
  let results = [];

  for (const node of nodes) {
    const lowerCaseNodeName = node.name.toLowerCase();
    if (lowerCaseNodeName.includes(lowerCaseKeyword)) {
      results.push(node);
    }
    if (node.children) {
      const childResults = searchNodes(node.children, keyword);
      results = results.concat(childResults);
    }
  }

  return results;
}
const Page = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  if (defaultData && dataList.length === 0) {
    generateList(defaultData);
    // console.log('dataList', dataList);
  }
  const debouncedOnChange = debounce((e) => {
    const { value } = e.target;
    console.log('value', value);
    const lowerCaseKeyword = value.toLowerCase();

    // const results = searchNodes(defaultData, value);
    // console.log('results', results);
    // return results;

    const newExpandedKeys = dataList
      .map((item) => {
        if (item.name.indexOf(lowerCaseKeyword) > -1) {
          return getParentKey(item.key, defaultData);
        }
        return null;
      })
      .filter((item, i, self) => !!(item && self.indexOf(item) === i));
    console.log('newExpandedKeys', newExpandedKeys);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  }, 500);

  const onChange = (e) => {
    debouncedOnChange(e);
  };
  const treeData = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const strTitle = item.name;
        const index = strTitle.toLowerCase().indexOf(searchValue.toLowerCase());
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const name =
          index > -1 ? (
            <span key={item.key}>
              {beforeStr}
              <span className="text-[#f50]">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span key={item.key}>{strTitle}</span>
          );
        if (item.children) {
          return {
            name,
            key: item.key,
            children: loop(item.children),
          };
        }
        return {
          name,
          key: item.key,
        };
      });
    return loop(defaultData);
  }, [searchValue]);
  return (
    <div>
      <Search
        style={{
          marginBottom: 8,
        }}
        placeholder="Search"
        onChange={onChange}
      />
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        fieldNames={{ title: 'name', key: 'key', children: 'children' }}
        // height={500}
      />
    </div>
  );
};
export default Page;
