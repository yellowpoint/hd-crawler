import InputBase from './InputBase';
import InputTree from './InputTree';

const Page = () => {
  return (
    <div className="flex flex-col gap-16">
      <p>方式一：</p>
      <InputBase />
      <p>方式二：</p>
      <InputTree />
    </div>
  );
};

export default Page;
