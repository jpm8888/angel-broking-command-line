const { mergeMap, Subject } = require('rxjs');

class DumpService {
  constructor() {
    this.queue = new Subject();
    this.results = this.queue.pipe(mergeMap((action) => action(), 1));
  }

  addToQueue(action) {
    this.queue.next(action);
  }

  finish() {
    this.queue.complete();
  }
}

module.exports = DumpService;
