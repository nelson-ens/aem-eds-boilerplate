/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { loadScript } from '../../../scripts/aem.js';
import { embedChilipiper } from '../chilipiper-embed.js';

jest.mock('../../../scripts/aem.js', () => ({
  loadScript: jest.fn(() => Promise.resolve()),
}));

// Mock global ChiliPiper object
global.ChiliPiper = {
  deploy: jest.fn(),
};

describe('embedChilipiper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call loadScript and ChiliPiper.deploy with correct arguments', async () => {
    const mockParams = {
      jsUrl: 'https://example.com/chilipiper.js',
      domain: 'test-domain',
      router: 'test-router',
      formType: 'test-form',
      target: 'test-target',
    };

    await embedChilipiper(mockParams);

    expect(loadScript).toHaveBeenCalledWith(
      'https://example.com/chilipiper.js?t=test-target',
    );
    expect(ChiliPiper.deploy).toHaveBeenCalledWith(
      'test-domain',
      'test-router',
      { formType: 'test-form' },
    );
  });
});
