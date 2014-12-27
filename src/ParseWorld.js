var ParseWorld = {
	_world: null,
		
	call: function (worldFile, world) {
		this._world = world;
		this._parseWorldFile(worldFile);
	},

	_parseWorldFile: function (worldFile) {
		var parser = this;
		cc.loader.loadTxt(worldFile, function(err, txt){
			parser._world.walls = {};
			parser._world.beepers = {};

			var lines = txt.split('\n');
			parser._parseWorldAttributes(lines.splice(0, 3));
			parser._parseWorldLines(lines);
			
			console.log('finished parsing world!');
		});
	},
	
	_parseWorldAttributes: function (attrs) {
		this._parseStartingPosition(attrs[0]);
		this._parseStartingDirection(attrs[1]);
		this._parseWorldSize(attrs[2]);
	},
	
	_parseWorldLines: function (lines) {
		var rowNum = 0;
		for(var i = lines.length-1; i >= 0; i--) {
			if (i % 2 === 0) {
				this._parseRow(lines[i], rowNum);
			} else {
				this._parseWallRow(lines[i], rowNum);
				rowNum++;
			}
		}
	},
	
	_parseStartingPosition: function (positionLine) {
		this._world.startingPosition = Util.stringToPoint(positionLine);
	},
	
	_parseStartingDirection: function (directionLine) {
		this._world.startingDirection = parseInt(directionLine);
	},
	
	_parseWorldSize: function (sizeLine) {
		this._world.size = Util.stringToSize(sizeLine);
	},
	
	_parseWallRow: function (wallString, y) {
		for (var i = 0; i < wallString.length; i+=2) {
			if (wallString.charAt(i) === '-') {
				var x = i/2;
				var pointsKey = Util.pointsToString(cc.p(x, y), cc.p(x, y+1));
				this._world.walls[pointsKey] = true;
			}
		}
	},
	
	_parseRow: function (rowString, y) {
		for (var i = 0; i < rowString.length; i++) {
			var x = Math.floor(i/2);
			if (i % 2 === 0){
				var numBeepers = parseInt(rowString.charAt(i));
				if (numBeepers) {
					this._world.beepers[Util.pointToString(cc.p(x,y))] = numBeepers;
				}
			} else {
				if (rowString.charAt(i) === '|' ) {
					var pointsKey = Util.pointsToString(cc.p(x, y), cc.p(x+1, y));
					this._world.walls[pointsKey] = true;
				}
			}
		}
	}

}