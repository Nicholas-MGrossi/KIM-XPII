const { expect } = require('chai');
const { tokenize, buildDocFreq, tfidfEmbed, cosineSim } = require('../../core.js');

describe('TF-IDF Utilities', () => {
  describe('tokenize()', () => {
    it('should lowercase text', () => {
      expect(tokenize('HELLO WORLD')).to.deep.equal(['hello', 'world']);
    });

    it('should remove punctuation', () => {
      expect(tokenize('hello, world!')).to.deep.equal(['hello', 'world']);
    });

    it('should filter words shorter than 3 chars', () => {
      expect(tokenize('a is the cat')).to.deep.equal(['the', 'cat']);
    });

    it('should handle empty string', () => {
      expect(tokenize('')).to.deep.equal([]);
    });
  });

  describe('buildDocFreq()', () => {
    it('should count term frequencies across documents', () => {
      const docs = ['hello world', 'hello there', 'world data'];
      const df = buildDocFreq(docs);
      expect(df.hello).to.equal(2);
      expect(df.world).to.equal(2);
      expect(df.there).to.equal(1);
      expect(df.data).to.equal(1);
    });
  });

  describe('tfidfEmbed()', () => {
    it('should generate TF-IDF vector', () => {
      const docFreq = { hello: 1, world: 1 };
      const N = 2;
      const vec = tfidfEmbed('hello world', docFreq, N);
      expect(vec.hello).to.be.greaterThan(0);
      expect(vec.world).to.be.greaterThan(0);
    });

    it('should handle unknown terms', () => {
      const docFreq = { new: 1, unknown: 1, here: 1 };
      const N = 2;
      const vec = tfidfEmbed('new unknown term here', docFreq, N);
      expect(vec.new).to.be.greaterThan(0);
      expect(vec.unknown).to.be.greaterThan(0);
    });
  });

  describe('cosineSim()', () => {
    it('should return 1 for identical vectors', () => {
      const v = { a: 1, b: 2 };
      expect(cosineSim(v, v)).to.be.closeTo(1, 0.0001);
    });

    it('should return 0 for orthogonal vectors', () => {
      const v1 = { a: 1 };
      const v2 = { b: 1 };
      expect(cosineSim(v1, v2)).to.equal(0);
    });

    it('should return 0 for zero vectors', () => {
      expect(cosineSim({}, {})).to.equal(0);
    });

    it('should handle sparse vectors', () => {
      const v1 = { a: 1, b: 0, c: 1 };
      const v2 = { a: 1, b: 1, c: 0 };
      const sim = cosineSim(v1, v2);
      expect(sim).to.be.greaterThan(0);
      expect(sim).to.be.lessThan(1);
    });
  });
});