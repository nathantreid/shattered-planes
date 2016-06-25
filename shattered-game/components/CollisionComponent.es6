'use strict';
import {serializable} from 'jsonc';
import Component from 'shattered-lib/Component';
import events from '/events';

@serializable('CollisionComponent')
class CollisionComponent extends Component {
  constructor() {
    super();
    this.addHandler(events.move, 50, this.onPosition);
    this.addHandler(events.willNotCollide, 50, this.onWillNotCollide);
  }

  onPosition(event) {
    return event.destination.emit({name: events.willNotCollide, entity: this.entity});
  }

  onWillNotCollide() {
    return false;
  }
}

CollisionComponent._name = 'collision';

export default CollisionComponent;