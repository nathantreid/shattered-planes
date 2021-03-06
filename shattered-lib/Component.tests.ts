'use strict';
import jsonc from '/lib/jsonc';
import Component from './Component.js';
import eventTypes from './event-system/eventTypes';

import chai from 'chai';
chai.should();
const expect = chai.expect;

describe('Component', () => {
  describe('constructor', ()=> {
    it ('should set the game property', ()=> {
      const game = {};
      const component = new Component(game);
      expect(component.game).to.equal(game); 
    });
  });
  
  describe('_addHandler', ()=> {
    it('should add the handler', () => {
      const component = new Component();
      component.addHandler(eventTypes.test);
      component.handlers.length.should.equal(1);
    });

    it('should supply the event name, priority, callback, and component', () => {
      const component = new Component();
      let priority = 10, callback = ()=>null;

      component.addHandler(eventTypes.test, 10, callback);

      const handler = component.handlers[0];
      handler.eventType.should.equal(eventTypes.test);
      handler.priority.should.equal(priority);
      handler.callback.should.equal(callback);
      handler.context.should.equal(component);
    });

  });

  describe('serialization', () => {
    it('should be serializable', () => {
      Component.__type__.should.equal('Component');
    });

    it('should deserialize properly', () => {
      const originalComponent = new Component();
      originalComponent.test = 'test';
      const serializedData = jsonc.serialize({component: originalComponent});
      const deserializedComponent = jsonc.deserialize(serializedData).component;
      deserializedComponent.test.should.equal('test');
    });
  });
});
