import core from '@actions/core';
import github, { context } from '@actions/github';

async function run() {
  console.log('Logging github event payload: ', JSON.stringify(github));
  console.log('Logging context: ', JSON.stringify(context));
}

run().catch((error) => {
  core.setFailed(`Action failed with error: ${error.message}`);
});
