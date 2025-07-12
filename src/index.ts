import MyPlugin from './Plugin';
import dotenv from 'dotenv';
dotenv.config();

import { start, clusterConfig  } from '@cdp-forge/plugin-pipeline-sdk';
import pluginConfig from './config/plugin';
console.log(clusterConfig);
const plugin = new MyPlugin(pluginConfig);
start(plugin, pluginConfig);