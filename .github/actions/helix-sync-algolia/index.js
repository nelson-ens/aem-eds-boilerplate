import core from '@actions/core';
import { context } from '@actions/github';

async function run() {
  console.log('Logging github event context: ', JSON.stringify(context));
}

run().catch((error) => {
  core.setFailed(`Action failed with error: ${error.message}`);
});
