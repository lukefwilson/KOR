var MAX_QUEUE_SIZE = 1000;
var commandDelay = 500;

var CommandQueue = cc.Class.extend({
		
	_queue: null,
	
	_bugHasOccured: null,
	
	ctor: function () {
		this._queue = [];
		this._bugHasOccured = false;
	},
		
	run: function () {
		this._performNextCommand(this);
	},
	
	addBug: function (text) {
		this.add(function () {
			console.log(text);
		});
		this._bugHasOccured = true;
	},

	add: function (command) {
		this._queue.push(command);
	},
	
	isAvailable: function () {
		return this._queue.length < MAX_QUEUE_SIZE && !this._bugHasOccured;
	},

	_performCommand: function (command) {
		console.log('running command - ' + this._queue.length + ' actions left in queue');
		command();
		setTimeout(this._performNextCommand, commandDelay, this)
	},

	_performNextCommand: function (commandQueue) {
		if (commandQueue._queue.length > 0) {
			commandQueue._performCommand(commandQueue._queue.splice(0,1)[0]);
		}
	}
});
