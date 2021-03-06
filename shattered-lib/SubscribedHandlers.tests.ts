'use strict';
import chai from 'chai';
import SubscribedHandlers from './SubscribedHandlers.js';

chai.should();
const expect = chai.expect;

describe('SubscribedHandlers', () => {

  describe('add', ()=> {
    it('should add a handler', ()=> {
      const subscriptions = new SubscribedHandlers();
      const handler = {eventName: 'test', priority: 0, component: {}};

      subscriptions.add(handler);
      subscriptions._events.has(handler.eventName).should.be.true;
    });

    it('should sort handlers by priority', ()=> {
      const handler1 = {eventName: 'test', priority: 0, component: {}};
      const handler2 = {eventName: 'test', priority: 1, component: {}};
      const handler3 = {eventName: 'test', priority: 2, component: {}};

      const subscriptions = new SubscribedHandlers();
      subscriptions.add(handler1);
      subscriptions.add(handler3);
      subscriptions.add(handler2);

      expect(subscriptions._handlersByEvent['test']).to.eql([handler1, handler2, handler3])
    });

    it('should sort handlers by component id', ()=> {
      const component1 = {
        id: 1
      };

      const component2 = {
        id: 2
      };

      const component3 = {
        id: 3
      };
      const handler1 = {eventName: 'test', priority: 0, component: component1};
      const handler2 = {eventName: 'test', priority: 0, component: component2};
      const handler3 = {eventName: 'test', priority: 0, component: component3};

      const subscriptions = new SubscribedHandlers();
      subscriptions.add(handler1);
      subscriptions.add(handler3);
      subscriptions.add(handler2);

      expect(subscriptions._handlersByEvent['test']).to.eql([handler1, handler2, handler3])
    });

    it('should sort handlers by priority then component', ()=> {
      const component1 = {
        id: 1
      };

      const component2 = {
        id: 2
      };
      const handler1 = {eventName: 'test', priority: 0, component: component1};
      const handler2 = {eventName: 'test', priority: 0, component: component2};
      const handler3 = {eventName: 'test', priority: 1, component: component1};

      const subscriptions = new SubscribedHandlers();
      subscriptions.add(handler3);
      subscriptions.add(handler2);
      subscriptions.add(handler1);

      expect(subscriptions._handlersByEvent['test']).to.eql([handler1, handler2, handler3])
    });

  });

  describe('emit', ()=> {

    it(`should emit the event to all of that event's handlers`, ()=> {
      const subscriptions = new SubscribedHandlers();
      let handler1Called = false;
      let handler2Called = false;
      const handler1 = {eventName: 'test', priority: 0, component: {}, callback: event => handler1Called = true};
      const handler2 = {eventName: 'test', priority: 0, component: {}, callback: event => handler2Called = true};

      subscriptions.add(handler1);
      subscriptions.add(handler2);

      const event = {name: 'test'};
      subscriptions.emit(event);

      handler1Called.should.be.true;
      handler2Called.should.be.true;
    });

    it(`should pass the event to the handler's callback`, ()=> {
      const subscriptions = new SubscribedHandlers();
      let handledEvent;
      const handler = {eventName: 'test', priority: 0, component: {}, callback: event => handledEvent = event};
      const event = {name: 'test'};
      subscriptions.add(handler);
      subscriptions.emit(event);

      handledEvent.should.equal(event);
    });

    it(`should return the event with updates from the handler's callback`, ()=> {
      const subscriptions = new SubscribedHandlers();
      let updatedEvent = {};
      const handler = {
        eventName: 'test',
        priority: 0,
        component: {},
        callback: event => event.updatedEvent = updatedEvent
      };
      const event = {name: 'test'};
      subscriptions.add(handler);
      const result = subscriptions.emit(event);

      expect(result.updatedEvent).to.equal(updatedEvent);
    });

    it(`should return the original event if the callback returns undefined`, ()=> {
      const subscriptions = new SubscribedHandlers();
      const handler = {
        eventName: 'test', priority: 0, component: {}, callback: event => {
        }
      };
      const event = {name: 'test'};
      subscriptions.add(handler);
      const result = subscriptions.emit(event);

      result.should.equal(event);
    });

  });

  describe('remove', ()=> {

    it('should remove a handler', ()=> {
      const subscriptions = new SubscribedHandlers();
      const handler = {eventName: 'test', priority: 0, component: {}};

      subscriptions.add(handler);
      subscriptions.remove(handler);
      subscriptions._events.has(handler.eventName).should.be.false;
    });

    it('should remove the event only after all handlers for the event have been removed', ()=> {
      const subscriptions = new SubscribedHandlers();
      const handler1 = {eventName: 'test', priority: 0, component: {}};
      const handler2 = {eventName: 'test', priority: 0, component: {}};

      subscriptions.add(handler1);
      subscriptions.add(handler2);
      subscriptions.remove(handler1);
      subscriptions._events.has(handler1.eventName).should.be.true;
      subscriptions.remove(handler2);
      subscriptions._events.has(handler2.eventName).should.be.false;
    });

  });

  describe('removeComponent', ()=> {

    it('should remove all of the components handlers', ()=> {
      const subscriptions = new SubscribedHandlers();
      const component = {
        handlers: []
      };
      component.handlers.push({eventName: 'test', priority: 0, component});
      component.handlers.push({eventName: 'test2', priority: 0, component});

      subscriptions.add(component.handlers[0]);
      subscriptions.add(component.handlers[1]);
      subscriptions.removeComponent(component);

      subscriptions._events.has(component.handlers[0].eventName).should.be.false;
      subscriptions._events.has(component.handlers[1].eventName).should.be.false;
    });

  });
});
