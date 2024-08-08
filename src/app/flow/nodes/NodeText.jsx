import NodeBase from './NodeBase';

export default function Node(props) {
  return (
    <NodeBase {...props}>
      {({ item }) => {
        return <div className="flex flex-col gap-8">{item.value}</div>;
      }}
    </NodeBase>
  );
}
