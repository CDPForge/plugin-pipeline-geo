import MyPlugin from './src/plugin/Plugin';
import { Log } from './src/types';

const plugin = new MyPlugin();

const log: Log = {
    client: 1,
    date: '2024-03-20',
    device: { id: 'test-device' },
    event: 'test-event',
    instance: 1,
    page: { title: 'test-page' },
    session: 'test-session',
    ip: '95.252.215.188'
};

plugin.elaborate(log).then(console.log);