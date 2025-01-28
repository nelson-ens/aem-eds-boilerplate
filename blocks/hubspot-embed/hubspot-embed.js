/* global hbspt */
import { div } from '../../scripts/dom-helpers.js';
import { loadScript } from '../../scripts/aem.js';
import generateId from '../../scripts/stringHelper.js';
import getBlockCfg from '../../scripts/blockHelpers.js';

const embedHubspot = async ({
  jsUrl, portalId, formId, target,
}) => {
  await loadScript(`${jsUrl}?t=${target}`);
  hbspt.forms.create({
    portalId,
    formId,
    target: `#${target}`,
  });
};

const loadEmbed = async ({
  block, jsUrl, portalId, formId, target,
}) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

  await embedHubspot({
    jsUrl, portalId, formId, target,
  });

  block.classList = 'block embed embed-hbspt';
  block.classList.add('embed-is-loaded');
};

/**
 *
 * Hubspot Embed
 * -----
 * jsUrl = https://js.hsforms.net/forms/embed/v2.js
 * portalId = 252628
 * formId = 16ee4cd1-22e1-4755-af5c-698508b60675
 *
 * jsUrl and portalId are optional and defaults to values specified above if not present
 * formId is required field
 *
 * @param {*} block
 */
export default async function decorate(block) {
  const { jsUrl, portalId, formId } = getBlockCfg(block, {
    jsUrl: 'https://js.hsforms.net/forms/embed/v2.js',
    portalId: '252628',
  });
  const target = `hbspt-embed-${generateId(5)}`;
  const form = div({
    id: target,
    class: 'hbspt-form',
  });

  block.innerHTML = '';
  block.appendChild(form);

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed({
        block, jsUrl, portalId, formId, target,
      });
    }
  });
  observer.observe(block);
}
