import InputBase from './InputBase';
import InputImg from './InputImg';
import InputTree from './InputTree';

const Page = () => {
  return (
    <div className="flex flex-col gap-16">
      <h1 className="text-36">Amazon</h1>
      <p>方式一：</p>
      <InputBase />
      <p>方式二：</p>
      <InputTree />
      <h1 className="text-36">Google图片</h1>
      <InputImg />
    </div>
  );
};

export default Page;
