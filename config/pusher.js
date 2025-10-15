import Pusher from 'pusher-js/react-native';
import { local, PUSHER_KEY, PUSHER_CLUSTER } from '@env';

const pusher = new Pusher('PUSHER_KEY', {
  cluster: 'PUSHER_CLUSTER',
});

export default pusher;
