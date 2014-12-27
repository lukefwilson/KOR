var Karel = cc.Node.extend({
	
	sprite: null,
	
	world: null,
	
	board: null,
	
	position: null,
	
	direction: null,
	
	commandQueue: null,
	
	delay: null,
		
	bugHasOccured: null,
	
	ctor: function (world, board) {
		this._super();
		
		this.world = world;
		this.board = board;
		this.position = world.startingPosition;
		this.direction = world.startingDirection;
		this.commandQueue = [];
		this.delay = 500;
		this.bugHasOccured = false;

		this.sprite = new cc.Sprite(res.ship_png);
		this.sprite.setScale(0.2);
		this.sprite.setPosition(this.board.pixelPositionForBoardPosition(this.position));
		this.sprite.setRotation(this.rotationForDirection(this.direction));

		board.addChild(this.sprite);
		this.run();
		this.act();
	},
	
	act: function () {
		this.performNextCommand(this);
	},
	
	canPushToCommandQueue: function () {
		return this.commandQueue.length < 500 && !this.bugHasOccured;
	},
	
	addToCommandQueue: function (command) {
		if (this.canPushToCommandQueue()) {
			this.commandQueue.push(command);
		}
	},
	
	performCommand: function (command) {
		console.log('running command - ' + this.commandQueue.length + ' actions left in queue');
		command();
		setTimeout(this.performNextCommand, this.delay, this)
	},
	
	performNextCommand: function (karel) {
		if (karel.commandQueue.length > 0) {
			karel.performCommand(karel.commandQueue.splice(0,1)[0]);
		}
	},
	
	rotationForDirection: function (direction) {
		switch(direction) {
			case Direction.NORTH:
				return 0;
			case Direction.EAST:
				return 90;
			case Direction.SOUTH:
				return 180;
			case Direction.WEST:
				return 270;
			default:
				return 0;
		}
	},
	
	rotateSpriteTo: function (direction) {
		var rotation = this.rotationForDirection(direction)
		var sprite = this.sprite;
		this.addToCommandQueue(function(){ sprite.setRotation(rotation) });
		console.log('rotate to ' + rotation)
	},
	
	moveSpriteTo: function (boardPosition) {
		this.position = boardPosition;
		var pixelPosition = this.board.pixelPositionForBoardPosition(boardPosition);
		
		var sprite = this.sprite;
		this.addToCommandQueue(function(){ sprite.setPosition(pixelPosition) });
		console.log('move to ' + pixelPosition.x+ ' ' + pixelPosition.y)
	},
	
	currentPositionWithOffset: function (xDiff, yDiff) {
		return cc.p(this.position.x+xDiff, this.position.y+yDiff)
	},
	
	positionInDirection: function (direction) {
		switch(direction) {
			case Direction.NORTH:
				return this.currentPositionWithOffset(0,1);
			case Direction.EAST:
				return this.currentPositionWithOffset(1,0);
			case Direction.SOUTH:
				return this.currentPositionWithOffset(0,-1);
			case Direction.WEST:
				return this.currentPositionWithOffset(-1,0);
			default:
				return this.currentPositionWithOffset(0,1);
		}
	},
	
	addBugToCommandQueue: function (text) {
		this.addToCommandQueue(function () {
			console.log(text);
		});
		console.log('buggggggggg');
		this.bugHasOccured = true;
	},

	move: function () {
		var newPosition = this.positionInDirection(this.direction);
		if (this.world.canMove(this.position, newPosition)) {
			this.moveSpriteTo(newPosition);
		} else {
			this.addBugToCommandQueue('BUG: can\'t move!');
		}
	},
	
	turnLeft: function () {
		this.direction--;
		if (this.direction < 0) this.direction = 3;
		this.rotateSpriteTo(this.direction);
	},
	
	putBeeper: function () {
		var world = this.world;
		var board = this.board;
		var position = this.position
		
		world.putBeeperAt(position);
		this.addToCommandQueue(function() { 
			board.putBeeperAt(position);
		});
	},
	
	pickBeeper: function () {
		if (this.world.canPickBeeperAt(this.position)) {
			var world = this.world;
			var board = this.board;
			var position = this.position;
			world.pickBeeperAt(position);

			this.addToCommandQueue(function() { 
				board.pickBeeperAt(position);
			});
		} else {
			this.addBugToCommandQueue('BUG: can\'t pick up a beeper that doesn\'t exist!');
		}
	},
	
	canMoveFromCurrentPositionTo: function (newPosition) {
		return this.world.canMove(this.position, newPosition) && this.canPushToCommandQueue();
	},
	
	frontIsClear: function () {
		return this.canMoveFromCurrentPositionTo(this.positionInDirection(this.direction)) && this.canPushToCommandQueue();
	},
	
	frontIsNotClear: function () {
		return !this.canMoveFromCurrentPositionTo(this.positionInDirection(this.direction)) && this.canPushToCommandQueue();
	},
	
	leftIsClear: function () {
		var directionToLeft = this.direction - 1;
		if (directionToLeft < 0) directionToLeft = 3;
		
		return this.canMoveFromCurrentPositionTo(this.positionInDirection(directionToLeft)) && this.canPushToCommandQueue();
	},
	
	leftIsNotClear: function () {
		var directionToLeft = this.direction - 1;
		if (directionToLeft < 0) directionToLeft = 3;

		return !this.canMoveFromCurrentPositionTo(this.positionInDirection(directionToLeft)) && this.canPushToCommandQueue();
	},
	
	rightIsClear: function () {
		var directionToRight = this.direction + 1;
		if (directionToRight > 3) directionToRight = 0;

		return this.canMoveFromCurrentPositionTo(this.positionInDirection(directionToRight)) && this.canPushToCommandQueue();
	},
	
	rightIsNotClear: function () {
		var directionToRight = this.direction + 1;
		if (directionToRight > 3) directionToRight = 0;

		return !this.canMoveFromCurrentPositionTo(this.positionInDirection(directionToRight)) && this.canPushToCommandQueue();
	},
	
	beepersPresent: function () {
		return this.world.canPickBeeperAt(this.position) && this.canPushToCommandQueue();
	},
	
	noBeepersPresent: function () {
		return !this.world.canPickBeeperAt(this.position) && this.canPushToCommandQueue();
	},
	
	facingNorth: function () {
		return this.direction === Direction.NORTH && this.canPushToCommandQueue();
	},
	
	notFacingNorth: function () {
		return this.direction !== Direction.NORTH && this.canPushToCommandQueue();
	},
	
	facingEast: function () {
		return this.direction === Direction.EAST && this.canPushToCommandQueue();
	},
	
	notFacingEast: function () {
		return this.direction !== Direction.EAST && this.canPushToCommandQueue();
	},
	
	facingSouth: function () {
		return this.direction === Direction.SOUTH && this.canPushToCommandQueue();
	},
	
	notFacingSouth: function () {
		return this.direction !== Direction.SOUTH && this.canPushToCommandQueue();
	},
	
	facingWest: function () {
		return this.direction === Direction.WEST && this.canPushToCommandQueue();
	},
	
	notFacingWest: function () {
		return this.direction !== Direction.WEST && this.canPushToCommandQueue();
	},
	
	// replacement for while(true) -> while(this.isTrue())
	isTrue: function () { 
		return this.canPushToCommandQueue();
	},
	
	run: function () {


	}
});