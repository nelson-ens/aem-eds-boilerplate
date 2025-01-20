import core from '@actions/core';
import { context } from '@actions/github';
import { faker } from '@faker-js/faker';
import { algoliasearch } from "algoliasearch";
import { createHash } from 'crypto';

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

function md5(str) { return createHash('md5').update(str).digest('hex') }

async function run() {
  console.log('Logging github event context: ', JSON.stringify(context));

  const apiKey = core.getInput('algolia-api-key');
  const appId = core.getInput('algolia-application-id');
  const indexName = core.getInput('algolia-index-name') || 'asdf';
  console.log('Logging apiKey: ', apiKey);
  console.log('Logging appId: ', appId);
  console.log('Logging indexName: ', indexName);

  const client = algoliasearch(appId, apiKey);

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

  const slug = faker.lorem.slug();
  const resourcePath = `/blogs/${slug}.md`;

  const record = {
    "webPath": `/blogs/${slug}`,
    "resourcePath": `${resourcePath}`,
    "name": `${faker.food.dish()}`,
    "lastModified": `${faker.date.anytime().getTime()}`,
    "title": `${faker.food.dish()}`,
    "image": `${faker.image.url()}`,
    "description": `${faker.food.description()}`,
    "category": `${faker.food.ethnicCategory()}`,
    "author": `${faker.book.author()}`,
    "date": `${faker.date.anytime().getTime()}`
  };
  console.log('Logging record: ', record);

  const algAddOrUpdateObjResponse = await client.addOrUpdateObject({
    indexName: indexName,
    objectID: md5(resourcePath),
    body: record
  });
}

run().catch((error) => {
  core.setFailed(`Action failed with error: ${error.message}`);
});
