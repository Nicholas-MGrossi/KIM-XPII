const { expect } = require('chai');
const { generateResponse } = require('../../core.js');

describe('Response Generation', () => {
  describe('generateResponse()', () => {
    it('should generate a response string', () => {
      const response = generateResponse('test query', []);
      expect(response).to.be.a('string');
      expect(response.length).to.be.greaterThan(0);
    });

    it('should include query keywords', () => {
      const response = generateResponse('vector search', []);
      expect(response).to.include('vector');
      expect(response).to.include('search');
    });

    it('should use different templates for different queries', () => {
      const r1 = generateResponse('aaa', []);
      const r2 = generateResponse('bbb', []);
      expect(r1).to.be.a('string');
      expect(r2).to.be.a('string');
    });

    it('should return consistent results for same query', () => {
      const r1 = generateResponse('test query', []);
      const r2 = generateResponse('test query', []);
      expect(r1).to.equal(r2);
    });
  });
});