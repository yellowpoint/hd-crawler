import Pusher from 'pusher';

const pusher = new Pusher({
  appId: '1826739',
  key: '1a7382794c3a45f962f9',
  secret: '29a3f89c1fe812d6b470',
  cluster: 'ap1',
  useTLS: true,
});
// pusher.trigger('my-channel', 'my-event', {
//   message: 'hello world',
// });

export default pusher;
