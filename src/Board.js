var SQUARE_SIZE = 80;

var Board = cc.Node.extend({

	_world: null,
		
	_beepers: null,
	
	_pixelSize: null,
	
	_boardLayer: null,
	
	_dotsNode: null,
	
	_wallsNode: null,
	
	_beepersNode: null,
	
	ctor: function (world) {
		this._super();
		
		this._world = world;
		this._beepers = JSON.parse(JSON.stringify(world.beepers)); // make a copy of the object
		this._pixelSize = cc.winSize.height;

		this._drawBoardLayer();
		this._drawDots();
		this._drawWalls();
		this._drawBeepers();
	},
	
	_drawBoardLayer: function () {
		var worldSize = this._world.size;
		
		var boardLayerWidth = worldSize.width * SQUARE_SIZE;
		var boardLayerHeight = worldSize.height * SQUARE_SIZE;
		
		this._boardLayer = new cc.LayerColor(cc.color(255,255,255,255), boardLayerWidth, boardLayerHeight);
		this._boardLayer.setPosition((this._pixelSize-boardLayerWidth)/2, (this._pixelSize-boardLayerHeight)/2);
		
		this.addChild(this._boardLayer);
	},

	_drawDots: function () {
		this._dotsNode = new cc.DrawNode();

		var worldSize = this._world.size;

		for (var x = 0; x < worldSize.width; x++) {
			for (var y = 0; y < worldSize.height; y++) {
				var layerPos = this._layerPositionForBoardPosition(cc.p(x, y));
				this._dotsNode.drawDot(layerPos, 3, cc.color(0,0,0,255));
			}
		}

		this._boardLayer.addChild(this._dotsNode);
	},
	
	_drawWalls: function () {
		this._wallsNode = new cc.DrawNode();
		
		var walls = this._world.walls;
		for (var key in walls) {
			if (!walls[key]) continue;
			
			var points = Util.stringToPoints(key);
			this._drawWall(points[0], points[1]);
		}
		
		this._boardLayer.addChild(this._wallsNode);
	},
	
	_drawWall: function (fromPos, toPos) {
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
		
		this._wallsNode.drawRect(fromPixelPos, toPixelPos, cc.color(0,0,0,255), 2, cc.color(0,0,0,255));
	},
	
	_drawBeepers: function () {		
		this._beepersNode = new cc.DrawNode();

		for (var key in this._beepers) {
			var numBeepers = this._beepers[key];
			if (numBeepers > 0) {
				var beeperPos = Util.stringToPoint(key);
				this._drawBeeper(beeperPos, numBeepers)
			}
		}

		this._boardLayer.addChild(this._beepersNode);
	},
	
	_drawBeeper: function (beeperPos, numBeepers) {
		var layerPos = this._layerPositionForBoardPosition(beeperPos);

		this._beepersNode.drawDot(layerPos, 15, cc.color(0,150,150,255));

		var label = new cc.LabelTTF(numBeepers);
		label.setPosition(layerPos);
		this._beepersNode.addChild(label);
	},
	
	_updateBeepers: function (position) {
		if (this._beepersNode) this._beepersNode.removeFromParent();
		this._drawBeepers();
	},
	
	_layerPositionForBoardPosition: function (boardPosition) {
		var boardLayerX = boardPosition.x * SQUARE_SIZE + (SQUARE_SIZE/2);
		var boardLayerY = boardPosition.y * SQUARE_SIZE + (SQUARE_SIZE/2);
		
		return cc.p(boardLayerX, boardLayerY);
	},
	
	putBeeperAt: function (position) {
		var pointKey = Util.pointToString(position);
		var beeperCount = this._beepers[pointKey] || 0;

		this._beepers[pointKey] = beeperCount+1;
		this._updateBeepers();
	},

	pickBeeperAt: function (position) {
		var pointKey = Util.pointToString(position);
		var beeperCount = this._beepers[pointKey] || 0;

		this._beepers[pointKey] = beeperCount-1;
		this._updateBeepers();
	},

	pixelPositionForBoardPosition: function(boardPosition) {
		var layerPosition = this._layerPositionForBoardPosition(boardPosition);
		var pixelPosition = this._boardLayer.convertToWorldSpace(layerPosition);
		
		return this.convertToNodeSpace(pixelPosition);
	}
});
