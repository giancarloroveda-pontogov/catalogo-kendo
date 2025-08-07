export default class Observer {
	#subscribers = [];
	#currentValue;

	constructor(initialValue) {
		this.#currentValue = initialValue;
	}

	subscribe(callback) {
		this.#subscribers.push(callback);
	}

	subscribeExecuting(callback) {
		callback(this.#currentValue);
		this.#subscribers.push(callback);
	}

	unsubscribe(callback) {
		this.#subscribers = this.#subscribers.filter(subscriber => subscriber !== callback);
	}

	next(data) {
		this.#subscribers.forEach(subscriber => subscriber(data));
	}
}