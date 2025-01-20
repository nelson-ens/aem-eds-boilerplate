import core from '@actions/core';
import { context } from '@actions/github';

/**
 *
 * @param owner {string}
 * @param repo {string}
 * @param branch {string}
 * @param path {string}
 * @returns {Promise<{webPath: string, resourcePath: string, results: {name: string, record: Record<string, any>}[]}>}
 */
async function fetchHelixResourceMetadata(owner, repo, branch, path) {
  path = path.replace(/^\/*/, '');
  const url = new URL(`https://admin.hlx.page/index/${owner}/${repo}/${branch}/${path}`);
  console.log(`Fetching Helix resource metadata from ${url}`);

  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch Helix resource metadata: ${response.status} ${response.statusText}`);

  return await response.json();
}

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
  console.log('Logging clientPayload: ', clientPayload);
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

  console.log('Logging helixResourceMetadata: ', JSON.stringify(helixResourceMetadata));
}

run().catch((error) => {
  core.setFailed(`Action failed with error: ${error.message}`);
});
