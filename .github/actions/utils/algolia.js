import { algoliasearch } from 'algoliasearch';

const client = algoliasearch('ALGOLIA_APPLICATION_ID', 'ALGOLIA_API_KEY');

export const addOrUpdateRecord = async () => {
  const response = await client.addOrUpdateObject({
    indexName: 'indexName',
    objectID: 'uniqueID',
    body: { key: 'value' },
  });

  return response;
}

export const deleteRecord = async (id) => {
  const response = await client.deleteObject({ indexName: 'ALGOLIA_INDEX_NAME', objectID: id });
}