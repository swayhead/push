const counter = require('../../helpers/counter');

class Queue {
	constructor(id) {
		this.id = id;
		this.tasks = [];
		this.running = false;

		this.exec = counter.attach('Queue#exec', this.exec, this);
		this.stop = counter.attach('Queue#stop', this.stop, this);
	}

	addTask(task) {
		this.tasks.push(task);
	}

	empty() {
		this.tasks = [];
	}

	exec() {
		return Promise.resolve();
	}

	stop() {
		this.running = false;
		return Promise.resolve();
	}
}

module.exports = Queue;
