var World = cc.Node.extend({

	size: null,
	
	walls: null,
	
	beepers: null,
	
	startingPosition: null,
	
	startingDirection: null,
		
	ctor: function (worldFile) {
		this._super();
		
		ParseWorld.call(worldFile, this);
	},
	
	putBeeperAt: function (point) {
		var pointKey = Util.pointToString(point);
		var beeperCount = this.beepers[pointKey] || 0;
		this.beepers[pointKey] = beeperCount+1;
	},
	
	canPickBeeperAt: function (point) {
		var pointKey = Util.pointToString(point);
		var beeperCount = this.beepers[pointKey] || 0;
		return beeperCount > 0;
	},
	
	pickBeeperAt: function (point) {
		var pointKey = Util.pointToString(point);
		var beeperCount = this.beepers[pointKey] || 0;
		this.beepers[pointKey] = beeperCount-1;
	},
	
	pointIsOutOfBounds: function (point) {
		if (point.x < 0 || point.x > this.size.width-1 ||
				point.y < 0 || point.y > this.size.height-1) {
			return true;
		}
		return false;
	},
	
	canMove: function (from, to) {
		if (this.walls[Util.pointsToString(from, to)] || 
				this.walls[Util.pointsToString(to, from)] ||
				this.pointIsOutOfBounds(from) ||
				this.pointIsOutOfBounds(to)) {
			return false;
		}
		return true;
	}
});
