// add delayed functionality here
import { loadScript } from './aem.js';

window.dataLayer = window.dataLayer || [];

console.log('loading delayed.js');
await loadScript('https://js.hs-scripts.com/252628.js');
window.addEventListener('message', (event) => {
  if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted') {
    // window.dataLayer.push({
    //   event: 'hubspot-form-success',
    //   'hs-form-guid': event.data.id,
    // });
  }
});
