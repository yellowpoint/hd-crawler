import { Icon } from '@iconify/react';

import InputBase from './InputBase';
import InputImg from './InputImg';
import InputTree from './InputTree';

const Page = () => {
  return (
    <div className="flex flex-col gap-16">
      <h1 className="flex items-center gap-8 text-36">
        <span className="icon-[devicon--amazonwebservices-wordmark]"></span>
        Amazon
      </h1>
      <p>方式一：</p>
      <InputBase />
      <p>方式二：</p>
      <InputTree />
      <h1 className="flex items-center gap-8 text-36">
        <span className="icon-[flat-color-icons--google]"></span>
        {/* <Icon icon="flat-color-icons:google" />
        <Icon icon="custom:collection" />
        <span className="icon-[custom--coo]"></span> */}
        Google图片
      </h1>
      <InputImg />
    </div>
  );
};

export default Page;
