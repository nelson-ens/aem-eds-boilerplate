import { div } from '../../scripts/dom-helpers.js';
import { loadScript } from '../../scripts/aem.js';
import generateId from '../../scripts/stringHelper.js'

const embedHubspot = async (block, {
  jsUrl, portalId, formId, target,
}) => {
  console.log('logging embedHubspot', {
    jsUrl, portalId, formId, target,
  });

  await loadScript(`${jsUrl}?t=${target}`);
  hbspt.forms.create({
    portalId,
    formId,
    target: `#${target}`,
  });
};

const loadEmbed = async (block, {
  jsUrl, portalId, formId, target,
}) => {
  console.log('logging loadEmbed', {
    jsUrl, portalId, formId, target,
  });
  if (block.classList.contains('embed-is-loaded')) {
    console.log('  contains "embed-is-loaded", exit');
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['hsforms'],
      embed: embedHubspot,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => jsUrl.includes(match)));
  if (config) {
    await config.embed(block, {
      jsUrl, portalId, formId, target,
    });
    block.classList = `block embed embed-${config.match[0]}`;
  } else {
    block.classList = 'block embed';
  }
  block.classList.add('embed-is-loaded');
};

export default async function decorate(block, index) {
  console.debug('hubspot-embed', block);
  const props = block.querySelectorAll('p');
  const jsUrl = props[0].innerHTML;
  const portalId = props[1].innerHTML;
  const formId = props[2].innerHTML;
  console.debug('logging', { jsUrl, portalId, formId });
  const target = `hubspot-embed-${generateId(5)}`;
  console.debug('target', { target });
  const form = div({
    id: target,
    class: 'hubspot-form',
  });

  block.innerHTML = '';
  block.appendChild(form);

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed(block, {
        jsUrl, portalId, formId, target,
      });
    }
  });
  observer.observe(block);
}
