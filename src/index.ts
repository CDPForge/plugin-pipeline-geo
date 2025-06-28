
import path from 'path';
import MyPlugin from './Plugin';
import { PipelineStage, Config, ConfigReader } from '@cdp-forge/plugin-pipeline-sdk';

const config: Config = ConfigReader.generate(path.join(__dirname, '../config/config.yml'), path.join(__dirname, '../config/plugin.yml'));
const stage = new PipelineStage(new MyPlugin(config), config);

stage.start(config.inputTopic, config.outputTopic);