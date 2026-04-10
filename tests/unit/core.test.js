const { expect } = require('chai');
require('../../app.js');

const mockSources = [
  { id: '1', title: 'Test Paper One', abstract: 'Abstract text here', source: 'arXiv', url: '#', authors: ['A'], published: '2024-01-01', citations: 10 },
  { id: '2', title: 'Test Paper Two', abstract: 'Different abstract', source: 'arXiv', url: '#', authors: ['B'], published: '2024-01-02', citations: 20 }
];

describe('Core Application Logic', () => {
  beforeEach(() => {
    initVectors();
  });

  describe('initVectors()', () => {
    it('should initialize document frequency', () => {
      expect(docFreq).to.be.an('object');
      expect(Object.keys(docFreq).length).to.be.greaterThan(0);
    });

    it('should initialize source vectors', () => {
      expect(sourceVectors).to.be.an('array');
      expect(sourceVectors.length).to.equal(mockSources.length);
    });
  });

  describe('findTopK()', () => {
    it('should return top K documents', () => {
      const results = findTopK('test paper', 2);
      expect(results).to.have.lengthOf(2);
    });

    it('should sort by similarity descending', () => {
      const results = findTopK('test', 3);
      for (let i = 1; i < results.length; i++) {
        expect(results[i-1].similarity).to.be.greaterThanOrEqual(results[i].similarity);
      }
    });

    it('should include similarity scores', () => {
      const results = findTopK('test', 1);
      expect(results[0]).to.have.property('similarity');
    });
  });

  describe('calculateConfidence()', () => {
    it('should return high for avgSim > 0.5', () => {
      const sources = [{ similarity: 0.6 }, { similarity: 0.7 }, { similarity: 0.6 }];
      const conf = calculateConfidence(sources);
      expect(conf.level).to.equal('high');
      expect(conf.label).to.equal('HIGH');
    });

    it('should return medium for 0.3 < avgSim <= 0.5', () => {
      const sources = [{ similarity: 0.4 }, { similarity: 0.4 }, { similarity: 0.4 }];
      const conf = calculateConfidence(sources);
      expect(conf.level).to.equal('medium');
      expect(conf.label).to.equal('MEDIUM');
    });

    it('should return low for avgSim <= 0.3', () => {
      const sources = [{ similarity: 0.1 }, { similarity: 0.2 }, { similarity: 0.1 }];
      const conf = calculateConfidence(sources);
      expect(conf.level).to.equal('low');
      expect(conf.label).to.equal('LOW');
    });
  });
});