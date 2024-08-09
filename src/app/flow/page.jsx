import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { useRequest, useSetState } from 'ahooks';
import { Button, Drawer } from 'antd';

import '@xyflow/react/dist/style.css';

import API from '@/lib/api';
import { ContextPage } from '@/lib/BaseContext.jsx';

import FlowRecord from './FlowRecord.jsx';
import nodeTypes from './nodes';

let flowRecordId = undefined;
export const flowDataDemo = {
  nodes: [
    {
      id: '0',
      position: { x: 0, y: 0 },
      data: { title: '上传图片', readonly: true, status: 'loading' },
      type: 'NodeImg',
    },
    {
      id: '1',
      position: { x: 0, y: 300 },
      data: { title: '识别图片', status: 'waiting' },
      type: 'NodeKeyword',
    },
    {
      id: '2',
      position: { x: 0, y: 650 },
      data: { title: '识图提取关键词' },
      type: 'NodeText',
    },
  ],
  edges: [
    {
      id: 'e1-2',
      source: '0',
      target: '1',
      label: '0-1',
      animated: true,
    },
    {
      id: 'e2-3',
      source: '1',
      target: '2',
      label: '1-2',
      animated: true,
    },
  ],
};
// init loading success error
export default function Flow() {
  let { id: flowId } = useParams();
  flowId = Number(flowId);
  const { data = {}, error } = useRequest(API.crud, {
    defaultParams: [{ model: 'flow', operation: 'readOne', id: flowId }],
    onSuccess: (data) => {
      console.log('data', data);
      const flowData = JSON.parse(data.content || '{}');
      // const flowData = flowDataDemo;
      setNodes(flowData.nodes);
      setEdges(flowData.edges);
      setPageData(flowData.nodes);
    },
  });

  const { data: _resPrompt, loading: loadingPrompt } = useRequest(API.crud, {
    defaultParams: [{ model: 'prompt', operation: 'readMany' }],
  });
  const resPrompt = _resPrompt?.list;
  // console.log('data', data.content, flowData);
  const [pageData, setPageData] = useSetState();
  const [nodes, setNodes] = useState();
  const [edges, setEdges] = useState();
  const [visible, setVisible] = useState(false);
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const next = async (id) => {
    const newData = pageData;
    const nextId = Number(id) + 1;
    const nextItem = newData[nextId];
    if (!nextItem) return;
    newData[nextId].data = {
      ...nextItem.data,
      status: 'loading',
    };
    setPageData(newData);
    const data = await API.crud({
      model: 'FlowRecord',
      operation: 'createOrUpdate',
      id: flowRecordId,
      data: {
        flowId,
        content: JSON.stringify(newData),
      },
    });
    console.log('data', data);

    flowRecordId = data.id;
  };
  const onOpenHistory = () => {
    setVisible(true);
  };
  const onCloseHistory = () => {
    setVisible(false);
  };
  return (
    <ContextPage.Provider
      value={{ pageData, setPageData, next, resPrompt, loadingPrompt }}
    >
      <div className="relative h-full w-full">
        <div className="absolute right-0 top-0 z-20">
          <Button onClick={onOpenHistory}>历史记录</Button>
        </div>
        <Drawer
          width="70%"
          title="历史记录"
          placement="right"
          closable={false}
          onClose={onCloseHistory}
          open={visible}
        >
          <FlowRecord flowId={flowId} onClose={onCloseHistory} />
        </Drawer>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          // fitView
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ContextPage.Provider>
  );
}
