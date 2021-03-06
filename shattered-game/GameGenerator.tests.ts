'use strict';
import chai from 'chai';
import GameGenerator from './GameGenerator.js';
import ROT from 'shattered-lib/lib/rot-js';
import idGenerator from 'shattered-lib/generators/idGenerator';

chai.should();
const expect = chai.expect;

describe('GameGenerator', () => {

  describe('generate', ()=> {
    it('should create a new game', () => {
      const gameGenerator = new GameGenerator();
      const game = gameGenerator.generate();
      game.should.be.ok;
    });

    it('should record the current ROT js seed', () => {
      const gameGenerator = new GameGenerator();
      const seed = 123;
      ROT.RNG.seed = seed;
      const game = gameGenerator.generate();
      game.seed.should.equal(seed);
    });

    it('should reset the id generator', () => {
      const gameGenerator = new GameGenerator();
      const oldReset = idGenerator.reset;
      let wasCalled = false;
      idGenerator.reset = ()=> wasCalled = true;

      gameGenerator.generate();

      expect(wasCalled).to.be.true;

      idGenerator.reset = oldReset;
    });

    it('should generate the specified number of levels', () => {
      let callCounter = 0;
      const gameGenerator = new GameGenerator();
      gameGenerator.LevelGenerator = class LevelGenerator {
        generateRandom() {
          callCounter++;
          return {};
        }
      };
      gameGenerator.generate({numberOfLevels: 22});
      callCounter.should.equal(22);
    });

    it('should create and start the game engine', () => {
      let callCounter = 0;
      const gameGenerator = new GameGenerator();
      gameGenerator.LevelGenerator = class LevelGenerator {
        generateRandom() {
          callCounter++;
          return {};
        }
      };
      const game = gameGenerator.generate({numberOfLevels: 22});
      game.engine.should.be.ok;
      callCounter.should.equal(22);
    });

  });

});
