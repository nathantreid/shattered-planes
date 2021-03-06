'use strict';
import eventTypes from 'shattered-lib/event-system/eventTypes';
import EventType from 'shattered-lib/event-system/EventType';

eventTypes.willNotCollide = new EventType('willNotCollide', eventTypes.getNextId());
eventTypes.isBlockingLight = new EventType('isBlockingLight', eventTypes.getNextId());
eventTypes.move = new EventType('move', eventTypes.getNextId());
eventTypes.onPosition = new EventType('onPosition', eventTypes.getNextId());
eventTypes.onTargetReached = new EventType('onTargetReached', eventTypes.getNextId());

let eventLookup = {};
const keys = Object.keys(eventTypes);
keys.forEach(key=>eventLookup[eventTypes[key].id] = key);

eventTypes.eventLookup = eventLookup;
export default eventTypes;
export {eventLookup};
