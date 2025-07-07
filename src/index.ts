import path from 'path';
import MyPlugin from './Plugin';
import { start, ConfigReader } from '@cdp-forge/plugin-pipeline-sdk';

const config = ConfigReader.generate(path.join(__dirname, '../config/config.yml'), path.join(__dirname, '../config/plugin.yml'));
const plugin = new MyPlugin(config);

start(plugin, config);