var SQUARE_SIZE = 100;

var Board = cc.Node.extend({

	world: null,
		
	beepers: null,
	
	size: null,
	
	boardLayer: null,
	
	dotsNode: null,
	
	wallsNode: null,
	
	beepersNode: null,
	
	ctor: function (world) {
		this._super();
		
		this.world = world;
		this.beepers = JSON.parse(JSON.stringify(world.beepers)); // make a copy of the object
		
		this.size = cc.winSize.height;
		var worldSize = this.world.size;

		var boardPixelWidth = worldSize.width * SQUARE_SIZE;
		var boardPixelHeight = worldSize.height * SQUARE_SIZE;
		
		this.boardLayer = new cc.LayerColor(cc.color(255,255,255,255), boardPixelWidth, boardPixelHeight);
		this.boardLayer.setPosition((this.size-boardPixelWidth)/2, (this.size-boardPixelHeight)/2);
		
		this.addChild(this.boardLayer);
		
		this.drawDots();
		this.drawWalls();
		this.drawBeepers();
	},

	drawDots: function () {
		this.dotsNode = new cc.DrawNode();

		var worldSize = this.world.size;

		for (var x = 0; x < worldSize.width; x++) {
			for (var y = 0; y < worldSize.height; y++) {
				var xPos = x * SQUARE_SIZE + (SQUARE_SIZE/2);
				var yPos = y * SQUARE_SIZE + (SQUARE_SIZE/2);
				this.dotsNode.drawDot(cc.p(xPos,yPos), 3, cc.color(0,0,0,255));
			}
		}

		this.boardLayer.addChild(this.dotsNode);
	},
	
	pointForPointString: function(pointString) {
		var pointArray = pointString.split(',');
		return cc.p(parseInt(pointArray[0]), parseInt(pointArray[1]));
	},

	drawWalls: function () {
		this.wallsNode = new cc.DrawNode();
		
		var walls = this.world.walls;
		for (var key in walls) {
			if (walls[key]) {
				var pointStrings = key.split('to');
				var fromPos = this.pointForPointString(pointStrings[0]);
				var toPos = this.pointForPointString(pointStrings[1]);
				
				var drawWallAboveFromPos = toPos.y > fromPos.y;
				
				var fromPixelPoint;
				var toPixelPoint;
				if (drawWallAboveFromPos) {
					var yPos = (fromPos.y+1) * SQUARE_SIZE
					fromPixelPoint = cc.p(fromPos.x * SQUARE_SIZE, yPos);
					toPixelPoint = cc.p((fromPos.x+1) * SQUARE_SIZE, yPos);
				} else {
					var xPos = (fromPos.x+1) * SQUARE_SIZE
					fromPixelPoint = cc.p(xPos, fromPos.y * SQUARE_SIZE);
					toPixelPoint = cc.p(xPos, (fromPos.y+1) * SQUARE_SIZE);
				}
				this.wallsNode.drawRect(fromPixelPoint, toPixelPoint, cc.color(0,0,0,255), 2, cc.color(0,0,0,255));
			}
		}
		
		this.boardLayer.addChild(this.wallsNode);
	},
	
	drawBeepers: function () {		
		this.beepersNode = new cc.DrawNode();

		var beepers = this.beepers;
		for (var key in beepers) {
			var beeperPoint = this.pointForPointString(key);
			var numBeepers = beepers[key];
			
			if (numBeepers > 0) {
				var xPos = beeperPoint.x * SQUARE_SIZE + (SQUARE_SIZE/2);
				var yPos = beeperPoint.y * SQUARE_SIZE + (SQUARE_SIZE/2);
				var pos = cc.p(xPos,yPos);
				this.beepersNode.drawDot(pos, 15, cc.color(0,150,150,255));
				
				var label = new cc.LabelTTF(numBeepers);
				label.setPosition(pos);
				this.beepersNode.addChild(label);
			}
		}

		this.boardLayer.addChild(this.beepersNode);
	},
	
	pointToString: function (point) {
		return point.x + ',' + point.y;
	},
	
	updateBeepers: function (position) {
		if (this.beepersNode) this.beepersNode.removeFromParent();
		this.drawBeepers();
	},
	
	putBeeperAt: function (position) {
		var pointKey = this.pointToString(position);
		var beeperCount = this.beepers[pointKey] || 0;
		this.beepers[pointKey] = beeperCount+1;
		this.updateBeepers();
	},
	
	pickBeeperAt: function (position) {
		var pointKey = this.pointToString(position);
		var beeperCount = this.beepers[pointKey] || 0;

		this.beepers[pointKey] = beeperCount-1;
		this.updateBeepers();

	},

	pixelPositionForBoardPosition: function(boardPosition) {
		var boardLayerX = boardPosition.x * SQUARE_SIZE + (SQUARE_SIZE/2);
		var boardLayerY = boardPosition.y * SQUARE_SIZE + (SQUARE_SIZE/2);
		
		var pixelPosition = this.boardLayer.convertToWorldSpace(cc.p(boardLayerX, boardLayerY));

		return this.convertToNodeSpace(pixelPosition);
	}


});
