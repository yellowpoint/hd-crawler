import React, { useMemo, useState } from 'react';

import { AutoComplete, Input } from 'antd';
import { debounce } from 'lodash';

import defaultData from '@/assets/amazon/Home&Kitchen.json';

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

const Page = ({ onChange }) => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const debouncedOnChange = debounce((value) => {
    const names = new Set();
    let results = searchNodes(defaultData, value)
      .filter((node) => !names.has(node.name) && names.add(node.name))
      .map((node) => ({
        value: node.name,
      }));

    setSuggestions(results);
    setShowResult(false);
  }, 500);

  const handleSearch = () => {
    setShowResult(true);
    onChange(suggestions.map((item) => item.value));
  };

  return (
    <div>
      <AutoComplete
        options={suggestions}
        // value={searchValue}
        onChange={debouncedOnChange}
        // onSelect={(value) => handleChange(value)}
      >
        <Input.Search
          placeholder="input here"
          enterButton
          onSearch={handleSearch}
        />
      </AutoComplete>
      {showResult && (
        <div className="mt-8">
          结果为：{JSON.stringify(suggestions.map((item) => item.value))}
        </div>
      )}
    </div>
  );
};
export default Page;
