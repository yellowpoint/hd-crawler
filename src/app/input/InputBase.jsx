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

const Options = ({ searchValue, suggestions }) => {
  const options = suggestions.map((suggestion) => (
    <AutoComplete.Option key={suggestion.name} value={suggestion.name}>
      {suggestion.name}
    </AutoComplete.Option>
  ));

  return (
    <AutoComplete.OptGroup key="options" label="Options">
      {options}
    </AutoComplete.OptGroup>
  );
};

const Page = () => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const debouncedOnChange = debounce((value) => {
    const names = new Set();
    let results = searchNodes(defaultData, value)
      .filter((node) => !names.has(node.name) && names.add(node.name))
      .map((node) => ({
        value: node.name,
      }));

    setSuggestions(results);
    console.log('suggestions:', results);
  }, 500);

  // const onChange = (value) => {
  //   setSearchValue(value);
  //   debouncedOnChange(value);
  // };

  return (
    <div>
      <AutoComplete
        options={suggestions}
        onSearch={debouncedOnChange}
        // value={searchValue}
      >
        <Input.Search placeholder="input here" />
      </AutoComplete>
    </div>
  );
};
export default Page;
