import { algoliasearch } from 'algoliasearch';

const client = algoliasearch('ALGOLIA_APPLICATION_ID', 'ALGOLIA_API_KEY');

async function addOrUpdateRecord() {
  const response = await client.addOrUpdateObject({
    indexName: 'indexName',
    objectID: 'uniqueID',
    body: { key: 'value' },
  });

  return response;
}

async function deleteRecord(id) {
  const response = await client.deleteObject({ indexName: 'ALGOLIA_INDEX_NAME', objectID: id });
}