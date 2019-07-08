class Loading {
	constructor(
		active = false,
		current = '',
		result = {
			set: false,
			status: false,
			message: '',
		},
		counter = 0,
	) {
		this.active = active;
		this.current = current;
		this.result = result;
		this.counter = counter;
	};

	setCounter(counter) {
		this.counter = counter;
		return this;
	}
	setCurrent(message) {
		this.current = message;
		return this;
	}
	setResult(status, message) {
		this.result = {
			set: true,
			status: status,
			message: message,
		};
		return this;
	}
}

export default Loading;
