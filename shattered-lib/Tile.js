'use strict';
import EntitiesByPriority from './EntitiesByPriority';
import Inventory from './Inventory';
import PrioritizedHandlers from './event-system/PrioritizedHandlers';
import events from '/event-system/eventTypes';
import Event from '/event-system/Event';

import { serializable } from '/lib/jsonc';

@serializable('Tile')
export default class Tile {
  _architecture = null;
  _handlers = new PrioritizedHandlers();
  inventory = new Inventory();
  occupant = null;

  constructor(point, map) {
    this.point = point;
    this.map = map;
  }

  get level() {
    return this.map.level;
  }

  get architecture() {
    return this._architecture;
  }

  set architecture(architecture) {
    const previousArchitecture = this._architecture;
    if (previousArchitecture)
      this._removeHandlers(previousArchitecture);

    this._architecture = architecture;
    if (architecture) {
      architecture.tile = this;
    }
  }

  addOccupant(occupant) {
    this.occupant = occupant;
    occupant.tile = this;

    const event = new Event(events.onEntityAdded);
    event.data.tile = this;
    this.emit(event);
  }

  removeOccupant(occupant) {
    if (this.occupant !== occupant)
      return;
    this.occupant = null;
    occupant.tile = null;

    const event = new Event(events.onEntityRemoved);
    event.data.tile = this;
    this.emit(event);
  }

  emit(event) {
    const shouldEmitToArchitecture = this._architecture.subscribedHandlers.numberOfHandlers > 0;
    const shouldEmitToOccupant = this.occupant !== null;
    const shouldEmitToSelf = this._handlers.numberOfHandlers > 0;

    for (let i = 0; i < event.type.priorities.array.length; i++) {
      let priority = event.type.priorities.array[i];
      if (shouldEmitToArchitecture) {
        this._architecture.subscribedHandlers.emitTo(priority, event);
        if (event.isCanceled) return event;
      }

      if (shouldEmitToOccupant) {
        this.occupant.subscribedHandlers.emitTo(priority, event);
        if (event.isCanceled) return event;
      }

      if (shouldEmitToSelf) {
        this._handlers.emitTo(priority, event);
        if (event.isCanceled) return event;
      }
    }
    return event;
  }

}
