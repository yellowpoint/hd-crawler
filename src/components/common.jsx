import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  QuestionCircleOutlined,
  HeartFilled,
  HeartOutlined,
} from '@ant-design/icons';
import { Select, Tooltip, Typography, message, Button, Tag, Spin } from 'antd';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';

import { blockchainArr } from '@/lib/constants';
import { sleep } from '@/lib/utils';

import styles from './index.module.less';

export const PageLoading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spin />
    </div>
  );
};

export const EllipsisMiddle = ({
  suffixCount = 4,
  children = '',
  className,
}) => {
  const start = children.slice(0, children.length - suffixCount);
  const suffix = children.slice(-suffixCount).trim();
  return (
    <Typography.Text
      style={{
        maxWidth: '100%',
        color: 'inherit',
      }}
      ellipsis={{
        suffix,
      }}
      className={className}
    >
      {start}
    </Typography.Text>
  );
};

// 如果有三层，中间需要加上min-width: 0;
export const EllipsisFlex = ({ children, className, rows = 1, ...props }) => {
  return (
    <Typography.Paragraph
      className={`!m-0 max-w-[100%] !text-inherit ${className || ''} `}
      ellipsis={{ tooltip: true, rows }}
      {...props}
    >
      {children}
    </Typography.Paragraph>
  );
};
export const TagList = ({
  list,
  max = Infinity,
  dark = false,
  onChange,
  value,
  disabled,
  style,
}) => {
  const defaultValue = (value || []).map((v) => parseInt(v, 10));
  const [selectedTags, setSelectedTags] = useState(defaultValue || []);
  const handleChange = (tag, checked) => {
    if (disabled) return;
    if (checked) {
      const nextSelectedTags =
        selectedTags.length >= max
          ? [tag, ...selectedTags.slice(0, max - 1)].sort(
              (a, b) => selectedTags.indexOf(a) - selectedTags.indexOf(b),
            )
          : [...selectedTags, tag].sort(
              (a, b) => selectedTags.indexOf(a) - selectedTags.indexOf(b),
            );
      setSelectedTags(nextSelectedTags);
      onChange?.(nextSelectedTags);
    } else {
      const nextSelectedTags = selectedTags.filter((t) => t !== tag);
      setSelectedTags(nextSelectedTags);
      onChange?.(nextSelectedTags);
    }
  };
  return (
    <div
      className={clsx(styles.tagList, {
        [styles.dark]: dark,
        [styles.disabled]: disabled,
      })}
      style={style}
    >
      {list?.map((item, index) => {
        if (typeof item === 'string') {
          return <Tag.CheckableTag key={index}>{item}</Tag.CheckableTag>;
        }
        const { id, name } = item || {};
        return (
          <Tag.CheckableTag
            key={index}
            checked={selectedTags.includes(id)}
            onChange={(checked) => handleChange(id, checked)}
          >
            {name}
          </Tag.CheckableTag>
        );
      })}
    </div>
  );
};

export const IconBox = ({ children, title }) => {
  return (
    <div className="relative m-auto flex h-656 w-632 flex-col items-center overflow-hidden rounded-32 bg-main px-64 text-black">
      <div className="mt-32">
        <img src="/icons/icon-black.svg" className="h-48 w-55" alt="icon" />
      </div>
      <div className="font-syne my-16 whitespace-nowrap text-36">{title}</div>
      {children}
    </div>
  );
};

export const ProjectCard = ({ item: { id, name, view_count, logo } }) => {
  return (
    <Link to={`/project/${id}`} className="flex h-54 items-center gap-24 ">
      <img className="h-54 w-54 rounded-16" src={logo} />
      <div className="flex h-full flex-col justify-between">
        <div>{name}</div>
        <div className="text-14">
          {view_count} <span className="text-text-2">views</span>
        </div>
      </div>
    </Link>
  );
};

export const AddToWishList = ({ added = false }) => {
  const [hasAdd, setHasAdd] = useState(added);
  const [loading, setloading] = useState(false);

  const onClick = async () => {
    setloading(true);
    await sleep(500);
    setHasAdd(!hasAdd);
    setloading(false);
  };
  return (
    <Button
      className="!flex items-center justify-center !rounded-21"
      type="primary"
      onClick={onClick}
      loading={loading}
      icon={hasAdd ? <HeartFilled /> : <HeartOutlined />}
    >
      {hasAdd ? 'Remove from wishlist' : 'Add to wishlist'}
    </Button>
  );
};

export const Warning = ({ children }) => {
  return (
    <div className="flex items-start gap-12 rounded-r-6 border-l-4 border-solid border-[#FBBF24] bg-[#FFFBEB33] p-16 text-[#FBBF24]">
      <img
        src="/icons/warning.svg"
        className="h-20 w-20 flex-none"
        alt="warning"
      />
      <div>
        {children ||
          `Please confirm your approval of the KOL's quote. If you have any questions, kindly engage with the KOL before clicking accept.`}
      </div>
    </div>
  );
};

export const ChainsSelect = ({ ...props }) => {
  return (
    <Select {...props}>
      {blockchainArr.map((item, index) => (
        <Select.Option key={index} value={item.id}>
          <div className="flex items-center gap-8">
            <img src={`/icons/chains/${item.id}.svg`} className="h-24 w-24" />
            {item.name}
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export const HelpTips = (props) => {
  return (
    <Tooltip {...props}>
      <QuestionCircleOutlined className="text-14 text-[#ffffff73]" />
    </Tooltip>
  );
};

export const copyText = (text) => {
  copy(text);
  message.success('Copy success!');
};
