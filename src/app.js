
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();

        var screenSize = cc.winSize;

        var world = new World('res/testWorld1.txt');
        var board = new Board(world);
        board.setPositionX(screenSize.width - screenSize.height - 25);
        this.addChild(board);
        
        var karel = new Karel(world, board);
        this.addChild(karel);

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

