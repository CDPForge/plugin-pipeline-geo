import MyPlugin from './plugin/Plugin';
import Config from './config';
import PipelineStage from './PipelineStage';
import RestEP from './RestEP';


const stage = new PipelineStage(new MyPlugin());
const restEP = new RestEP(async (body: { inputTopic: string, outputTopic: string | null }) => {
  await stage.restart(body.inputTopic, body.outputTopic);
});

fetch(`${Config.getInstance().config.pluginManagerUrl}/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(Config.getInstance().config.plugin),
}).then(res => {
  if (!res.ok) {
    throw new Error(`Failed to register plugin with Template Manager: ${res.statusText}`);
  }
  return res.json() as Promise<{ inputTopic: string, outputTopic: string }>;
}).then(json => {
  if (!json || !json.inputTopic || !json.outputTopic) {
    throw new Error('Failed to fetch plugin configuration from Template Manager.');
  }
  stage.start(json.inputTopic, json.outputTopic);
  restEP.start();
});

const handleExit = async () => {
  console.log('Arresto del server in corso...');
  await stage.stop();
  process.exit(0);
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);