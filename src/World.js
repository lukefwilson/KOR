var World = cc.Node.extend({

	size: null,
	
	walls: null,
	
	beepers: null,
	
	startingPosition: null,
	
	startingDirection: null,
		
	ctor: function (worldFile) {
		this._super();
		
		this.parseWorldFile(worldFile);
	},
	
	putBeeperAt: function (point) {
		var pointKey = this.pointToString(point);
		var beeperCount = this.beepers[pointKey] || 0;
		this.beepers[pointKey] = beeperCount+1;
	},
	
	canPickBeeperAt: function (point) {
		var pointKey = this.pointToString(point);
		var beeperCount = this.beepers[pointKey] || 0;
		return beeperCount > 0;
	},
	
	pickBeeperAt: function (point) {
		var pointKey = this.pointToString(point);
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
		if (this.walls[this.pointsToString(from, to)] || 
				this.walls[this.pointsToString(to, from)] ||
				this.pointIsOutOfBounds(from) ||
				this.pointIsOutOfBounds(to)) {
			return false;
		}
		return true;
	},
	
	pointToString: function (point) {
		return point.x + ',' + point.y;
	},
	
	pointsToString: function (point1, point2) {
		return this.pointToString(point1) + 'to' + this.pointToString(point2);
	},
	
	parseWorldFile: function (worldFile) {
		var world = this;
		cc.loader.loadTxt(worldFile, function(err, txt){
			world.walls = {};
			world.beepers = {};
			// By lines
			var lines = txt.split('\n');
			
			var worldPropertyLines = lines.splice(0, 3);
			world.parseStartingPosition(worldPropertyLines[0]);
			world.parseStartingDirection(worldPropertyLines[1]);
			world.parseWorldSize(worldPropertyLines[2]);
			
			var rowNum = 0;
			for(var i = lines.length-1; i >= 0; i--){
				console.log(lines[i]);
				if (i % 2 === 0) {
					world.parseRow(lines[i], rowNum);
				} else {
					world.parseWallRow(lines[i], rowNum);
					rowNum++;
				}
			}
			
			console.log(JSON.stringify(world.beepers));
			console.log(JSON.stringify(world.walls));

		});
	},
	
	parseStartingPosition: function (positionLine) {
		var pointArray = positionLine.split(',');
		this.startingPosition = cc.p(parseInt(pointArray[0]), parseInt(pointArray[1]));
	},
	
	parseStartingDirection: function (directionLine) {
		this.startingDirection = parseInt(directionLine);
	},
	
	parseWorldSize: function (sizeLine) {
		var sizeArray = sizeLine.split(',');
		this.size = cc.size(parseInt(sizeArray[0]), parseInt(sizeArray[1]));
	},
	
	parseWallRow: function (wallString, y) {
		for (var i = 0; i < wallString.length; i+=2) {
			if(wallString.charAt(i) === '-') {
				var x = i/2;
				var pointsKey = this.pointsToString(cc.p(x, y), cc.p(x, y+1));
				this.walls[pointsKey] = true;
			}
		}
	},
	
	parseRow: function (rowString, y) {
		for (var i = 0; i < rowString.length; i++) {
			var x = Math.floor(i/2);
			if (i % 2 === 0){
				var numBeepers = parseInt(rowString.charAt(i));
				if (numBeepers) {
					this.beepers[this.pointToString(cc.p(x,y))] = numBeepers;
				}
			} else {
				if (rowString.charAt(i) === '|' ) {
					var pointsKey = this.pointsToString(cc.p(x, y), cc.p(x+1, y));
					this.walls[pointsKey] = true;
				}
			}
		}
	}
	
	
});
