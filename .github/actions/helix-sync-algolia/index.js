import core from '@actions/core';
import { context } from '@actions/github';
import { fetchHelixResourceMetadata } from "../utils/eds.js";

async function run() {
  console.log('Logging github event context: ', JSON.stringify(context));

  const apiKey = core.getInput('algolia-api-key');
  const appId = core.getInput('algolia-application-id');
  const indexName = core.getInput('algolia-index-name');

  const branchName = context.ref.replace('refs/heads/', '');
  console.log('Logging branchName: ', branchName);

  /**
   * @type {{org: string, path: string, site: string, status: number}}
   */
  const clientPayload = context.payload.client_payload;
  if (!clientPayload) {
    throw new Error('No client payload found.');
  }

  const eventType = context.payload.action;
  console.log('Logging eventType: ', eventType);

  const helixResourceMetadata = await fetchHelixResourceMetadata(
    clientPayload.org,
    clientPayload.site,
    branchName,
    clientPayload.path
  );

  console.log('Logging helixResourceMetadata: ', helixResourceMetadata);
}

run().catch((error) => {
  core.setFailed(`Action failed with error: ${error.message}`);
});
