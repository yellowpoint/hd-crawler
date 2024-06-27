import { useEffect } from 'react';

// import io from 'socket.io-client';
// import WebSocket from 'websocket';

const Ws = () => {
  useEffect(() => {
    // const socket = io('ws://localhost:4000/ws/test');
    const ws = new WebSocket('ws://localhost:4000/api/ws/test');
    ws.onopen = () => {
      console.log('Connected to the server');
    };

    ws.onmessage = (event) => {
      // const message = JSON.parse(event.data);
      console.log('Received message:', event);
      // setData(message.message + ' (' + message.time + ')');
    };

    ws.onclose = (event) => {
      // const message = JSON.parse(event.data);
      console.log('onclose message:', event);
      console.log('Disconnected from the server');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    // ws.send('Hello, Server!');

    // 组件卸载时关闭 WebSocket 连接
    return () => {
      ws.close();
    };
  }, []);

  return (
    // 组件内容...
    <div>我是ws测试</div>
  );
};

export default Ws;
