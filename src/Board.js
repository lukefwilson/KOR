var SQUARE_SIZE = 80;

var Board = cc.Node.extend({

	world: null,
		
	beepers: null,
	
	pixelSize: null,
	
	boardLayer: null,
	
	dotsNode: null,
	
	wallsNode: null,
	
	beepersNode: null,
	
	ctor: function (world) {
		this._super();
		
		this.world = world;
		this.beepers = JSON.parse(JSON.stringify(world.beepers)); // make a copy of the object
		this.pixelSize = cc.winSize.height;

		this.drawBoardLayer();
		this.drawDots();
		this.drawWalls();
		this.drawBeepers();
	},
	
	drawBoardLayer: function () {
		var worldSize = this.world.size;
		
		var boardLayerWidth = worldSize.width * SQUARE_SIZE;
		var boardLayerHeight = worldSize.height * SQUARE_SIZE;
		
		this.boardLayer = new cc.LayerColor(cc.color(255,255,255,255), boardLayerWidth, boardLayerHeight);
		this.boardLayer.setPosition((this.pixelSize-boardLayerWidth)/2, (this.pixelSize-boardLayerHeight)/2);
		
		this.addChild(this.boardLayer);
	},

	drawDots: function () {
		this.dotsNode = new cc.DrawNode();

		var worldSize = this.world.size;

		for (var x = 0; x < worldSize.width; x++) {
			for (var y = 0; y < worldSize.height; y++) {
				var layerPos = this.layerPositionForBoardPosition(cc.p(x, y));
				this.dotsNode.drawDot(layerPos, 3, cc.color(0,0,0,255));
			}
		}

		this.boardLayer.addChild(this.dotsNode);
	},
	
	drawWalls: function () {
		this.wallsNode = new cc.DrawNode();
		
		var walls = this.world.walls;
		for (var key in walls) {
			if (!walls[key]) continue;
			
			var points = Util.stringToPoints(key);
			this.drawWall(points[0], points[1]);
		}
		
		this.boardLayer.addChild(this.wallsNode);
	},
	
	drawWall: function (fromPos, toPos) {
		var fromPixelPos;
		var toPixelPos;
		
		if (toPos.y > fromPos.y) { // horizontal wall
			var yPos = (fromPos.y+1) * SQUARE_SIZE
			fromPixelPos = cc.p(fromPos.x * SQUARE_SIZE, yPos);
			toPixelPos = cc.p((fromPos.x+1) * SQUARE_SIZE, yPos);
		} else { // vertical wall
			var xPos = (fromPos.x+1) * SQUARE_SIZE
			fromPixelPos = cc.p(xPos, fromPos.y * SQUARE_SIZE);
			toPixelPos = cc.p(xPos, (fromPos.y+1) * SQUARE_SIZE);
		}
		
		this.wallsNode.drawRect(fromPixelPos, toPixelPos, cc.color(0,0,0,255), 2, cc.color(0,0,0,255));
	},
	
	drawBeepers: function () {		
		this.beepersNode = new cc.DrawNode();

		for (var key in this.beepers) {
			var numBeepers = this.beepers[key];
			if (numBeepers > 0) {
				var beeperPos = Util.stringToPoint(key);
				this.drawBeeper(beeperPos, numBeepers)
			}
		}

		this.boardLayer.addChild(this.beepersNode);
	},
	
	drawBeeper: function (beeperPos, numBeepers) {
		var layerPos = this.layerPositionForBoardPosition(beeperPos);

		this.beepersNode.drawDot(layerPos, 15, cc.color(0,150,150,255));

		var label = new cc.LabelTTF(numBeepers);
		label.setPosition(layerPos);
		this.beepersNode.addChild(label);
	},
	
	updateBeepers: function (position) {
		if (this.beepersNode) this.beepersNode.removeFromParent();
		this.drawBeepers();
	},
	
	putBeeperAt: function (position) {
		var pointKey = Util.pointToString(position);
		var beeperCount = this.beepers[pointKey] || 0;
		
		this.beepers[pointKey] = beeperCount+1;
		this.updateBeepers();
	},
	
	pickBeeperAt: function (position) {
		var pointKey = Util.pointToString(position);
		var beeperCount = this.beepers[pointKey] || 0;

		this.beepers[pointKey] = beeperCount-1;
		this.updateBeepers();
	},
	
	layerPositionForBoardPosition: function (boardPosition) {
		var boardLayerX = boardPosition.x * SQUARE_SIZE + (SQUARE_SIZE/2);
		var boardLayerY = boardPosition.y * SQUARE_SIZE + (SQUARE_SIZE/2);
		
		return cc.p(boardLayerX, boardLayerY);
	},


	pixelPositionForBoardPosition: function(boardPosition) {
		var layerPosition = this.layerPositionForBoardPosition(boardPosition);
		var pixelPosition = this.boardLayer.convertToWorldSpace(layerPosition);
		
		return this.convertToNodeSpace(pixelPosition);
	}


});
