/* global ChiliPiper  */
import { div } from '../../scripts/dom-helpers.js';
import { loadScript } from '../../scripts/aem.js';
import generateId from '../../scripts/stringHelper.js';

const embedChilipiper = async (block, {
  jsUrl, orgId, formId, formType, target,
}) => {
  console.log('logging embedChilipiper', {
    jsUrl, orgId, formId, formType, target,
  });

  await loadScript(`${jsUrl}?t=${target}`);
  ChiliPiper.deploy(orgId, `#${target}`, { formType, formIds: [`${target}`] });
};

const loadEmbed = async (block, {
  jsUrl, orgId, formId, formType, target,
}) => {
  console.log('logging loadEmbed', {
    jsUrl, orgId, formId, formType,
  });
  if (block.classList.contains('embed-is-loaded')) {
    console.log('  contains "embed-is-loaded", exit');
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['chilipiper'],
      embed: embedChilipiper,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => jsUrl.includes(match)));
  if (config) {
    await config.embed(block, {
      jsUrl, orgId, formId, formType, target,
    });
    block.classList = `block embed embed-${config.match[0]}`;
  } else {
    block.classList = 'block embed';
  }
  block.classList.add('embed-is-loaded');
};

export default async function decorate(block) {
  console.debug('chilipiper-embed', block);
  const props = block.querySelectorAll('p');
  const jsUrl = props[0].innerHTML;
  const orgId = props[1].innerHTML;
  const formId = props[2].innerHTML;
  const formType = props[3].innerHTML;
  console.debug('logging', {
    jsUrl, orgId, formId, formType,
  });
  const target = `chilipiper-embed-${generateId(5)}`;
  console.debug('target', { target });
  const cp = div({
    id: target,
    class: 'chilipiper-embed-children',
  });

  block.innerHTML = '';
  block.appendChild(cp);

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed(block, {
        jsUrl, orgId, formId, formType, target,
      });
    }
  });
  observer.observe(block);
}
