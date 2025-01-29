/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { loadScript } from '../../../scripts/aem.js';
import { embedHubspot } from '../hubspot-embed.js';

jest.mock('../../../scripts/aem.js', () => ({
  loadScript: jest.fn(() => Promise.resolve()),
}));

// Mock global hbspt object
global.hbspt = {
  forms: {
    create: jest.fn(),
  },
};

describe('embedHubspot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call loadScript and hbspt.forms.creates with correct arguments', async () => {
    const mockParams = {
      jsUrl: 'https://js.hsforms.net/forms/embed/v2.js',
      portalId: 'test-portalId',
      formId: 'test-formId',
      target: 'test-target',
    };

    await embedHubspot(mockParams);

    expect(loadScript).toHaveBeenCalledWith(
      'https://js.hsforms.net/forms/embed/v2.js?t=test-target',
    );
    expect(hbspt.forms.create).toHaveBeenCalledWith(
      {
        portalId: 'test-portalId',
        formId: 'test-formId',
        target: '#test-target',
      },
    );
  });
});
