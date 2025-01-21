/**
 *
 * @param owner {string}
 * @param repo {string}
 * @param branch {string}
 * @param path {string}
 * @returns {Promise<{webPath: string, resourcePath: string, results: {name: string, record: Record<string, any>}[]}>}
 */
export const fetchHelixResourceMetadata = async (owner, repo, branch, path) => {
  path = path.replace(/^\/*/, '');
  const url = new URL(`https://admin.hlx.page/index/${owner}/${repo}/${branch}/${path}`);
  console.log(`Fetching Helix resource metadata from ${url}`);

  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch Helix resource metadata: ${response.status} ${response.statusText}`);

  return await response.json();
};
