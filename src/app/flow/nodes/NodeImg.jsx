import NodeBase from './NodeBase';

export default function Node(props) {
  return (
    <NodeBase {...props}>
      {(item) => {
        return (
          <img
            className="h-240 w-300 object-contain"
            alt="example"
            src={item.value}
          />
        );
      }}
    </NodeBase>
  );
}
