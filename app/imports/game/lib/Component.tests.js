'use strict';
import chai from 'chai';
import jsonc from 'jsonc';
import Component from './Component.js';

chai.should();

describe('Component', () => {

  describe('constructor', ()=> {
    it('should instantiate the stats object', ()=> {
      const component = new Component();

      component._stats.should.be.ok;
    });
  });

  describe('_addHandler', ()=> {
    it('should add the handler', () => {
      const component = new Component();
      component.addHandler({});
      component._handlers.length.should.equal(1);
    });

    it('should supply the event name, priority, callback, and component', () => {
      const component = new Component();
      let eventName = 'test', priority = 10, callback = ()=>null;

      component.addHandler('test', 10, callback);

      const handler = component._handlers[0];
      handler.eventName.should.equal(eventName);
      handler.priority.should.equal(priority);
      handler.callback.should.equal(callback);
      handler.component.should.equal(component);
    });

  });

  describe('serialization', () => {
    it('should be serializable', () => {
      Component.__type__.should.equal('Component');
    });

    it('should deserialize properly', () => {
      const originalComponent = new Component();
      originalComponent._stats.test = 'test';
      const serializedData = jsonc.serialize({component: originalComponent});
      const deserializedComponent = jsonc.deserialize(serializedData).component;
      deserializedComponent._stats.test.should.equal('test');
    });
  });
});