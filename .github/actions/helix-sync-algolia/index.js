import core from '@actions/core';
import github from '@actions/github';

async function run() {
  console.log('Logging github event payload: ', JSON.stringify(github));
}

run().catch((error) => {
  core.setFailed(`Action failed with error: ${error.message}`);
});
