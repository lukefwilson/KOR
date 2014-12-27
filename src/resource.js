var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    ship_png : "res/ship.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

var Direction = Object.freeze({NORTH: 0, EAST: 1, SOUTH: 2, WEST: 3});