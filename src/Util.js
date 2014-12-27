var Util = {
	pointToString: function (point) {
		return point.x + ',' + point.y;
	},
	
	stringToPoint:function (pointString) {
		var pointArray = pointString.split(',');
		return cc.p(parseInt(pointArray[0]), parseInt(pointArray[1]));
	},
	
	pointsToString: function (point1, point2) {
		return this.pointToString(point1) + 'to' + this.pointToString(point2);
	},
	
	stringToPoints: function (pointsString) {
		var pointStrings = pointsString.split('to');
		var firstPoint = this.stringToPoint(pointStrings[0]);
		var secondPoint = this.stringToPoint(pointStrings[1]);
		return [firstPoint, secondPoint];
	},
	
	stringToSize:function (sizeString) {
		var sizeArray = sizeString.split(',');
		return cc.size(parseInt(sizeArray[0]), parseInt(sizeArray[1]));
	}
}