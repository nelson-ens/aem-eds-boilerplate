import { loadScript } from '../../scripts/aem.js';

const loadScript2 = (block, { jsUrl, portalId, formId }, type) => {
  console.log('logging loadScript2', { jsUrl, portalId, formId });
  const script = document.createElement('script');
  if (type) {
    script.setAttribute('type', type);
  }

  script.text = ''
      + '    hbspt.forms.create({'
      + `      portalId: '${portalId}',`
      + `     formId: '${formId}',`
      + '    });';

  console.log('logging loadScript2', script);
  block.append(script);
  return script;
};

const embedHubspot = async (block, { jsUrl, portalId, formId }) => {
  console.log('logging embedHubspot', { jsUrl, portalId, formId });
  await loadScript(jsUrl);
  loadScript2(block, { jsUrl, portalId, formId }, 'text/javascript');
};

const loadEmbed = async (block, { jsUrl, portalId, formId }) => {
  console.log('logging loadEmbed', { jsUrl, portalId, formId });
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
    await config.embed(block, { jsUrl, portalId, formId });
    block.classList = `block embed embed-${config.match[0]}`;
  } else {
    block.classList = 'block embed';
  }
  block.classList.add('embed-is-loaded');
};

export default async function decorate(block) {
  console.debug('hubspot-embed', block);
  const props = block.querySelectorAll('p');
  const jsUrl = props[0].innerHTML;
  const portalId = props[1].innerHTML;
  const formId = props[2].innerHTML;
  console.debug('logging', { jsUrl, portalId, formId });
  block.textContent = '';

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed(block, { jsUrl, portalId, formId });
    }
  });
  observer.observe(block);
}
