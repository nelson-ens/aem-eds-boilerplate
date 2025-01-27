/* global hbspt */
import { div } from '../../scripts/dom-helpers.js';
import { loadScript } from '../../scripts/aem.js';
import generateId from '../../scripts/stringHelper.js';

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

const getBlockCfg = (block) => {
  const props = block.querySelectorAll('p');
  const blockCfg = {};

  for (let i = 0; i < props.length; i += 2) {
    if (props[i]?.textContent !== undefined && props[i + 1]?.textContent !== undefined) {
      blockCfg[props[i].textContent] = props[i + 1].textContent;
    }
  }

  return blockCfg;
};

export default async function decorate(block) {
  const { jsUrl, portalId, formId } = getBlockCfg(block);
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
