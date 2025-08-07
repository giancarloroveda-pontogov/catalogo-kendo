export default class ValidationError extends Error {
	constructor(message, errors) {
		super(message);
		this.name = this.constructor.name;
		this.code = "validation_error";
		this.errors = errors;
	}
}