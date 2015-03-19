Karel-Cocos2d
===

Karel is a great tool for learning programming fundamentals. You command a robot (or in this case a space ship), around a grid world. Accomplish various tasks while learning control structures, abstraction, and more. Learn more about its origins [here](http://en.wikipedia.org/wiki/Karel_%28programming_language%29). 

This project was built to be used at [StreetCode Academy](http://www.liveinpeace.org/streetcode-academy/). It is currently not in use, nor maintained, but it is a great place to start if you wish to create your own Cocos2d Karel the Robot port.

##Usage##

- Clone the repo and open it in Code IDE or whatever you prefer
- Edit the run function in run.js file
```
/* Commands */

this.move();
this.turnLeft();
this.putBeeper();
this.pickBeeper();

/* Conditionals */

this.frontIsClear();
this.frontIsNotClear();
this.leftIsClear();
this.leftIsNotClear();
this.rightIsClear();
this.rightIsNotClear();
this.beepersPresent();
this.noBeepersPresent();
this.facingNorth();
this.notFacingNorth();
this.facingEast);
this.notFacingEast();
this.facingSouth();
this.notFacingSouth();
this.facingWest();
this.notFacingWest();
this.isTrue(); // a replacement for while(true) -> while(this.isTrue())
```

###Level Parser###

KOR parses a basic .txt file to create the world. Checkout `res/testWorld1.txt` to get a feeling for how the file looks.

To change the world, edit `app.js` and pass your world file into the `World` constructor

The first 3 lines are basic attributes for the world:

1. Karel's starting position i.e. `0,0`
2. Karel's starting direction i.e. `0` -> `NORTH: 0, EAST: 1, SOUTH: 2, WEST: 3` (defined in resource.js)
3. World size i.e. `5,6` 

The rest of the .txt file is the world in ASCII format. It allows you to place walls and 0-9 beepers in any location on the board.

#####To understand how the world is parsed, it is best to see an example:#####

```
0,0
0
4,3
2 * * 1
- -    
* * * *
      
*|2 * *
```
For this example world, the basic attributes are:
- Karel starts at `0,0`
- Karel starts facing north
- The world is a 4x3 grid

The world itself:
- has walls between:
  - (0,0) and (1,0)
  - (0,1) and (0,2)
  - (1,1) and (1,2)
- has beepers:
  - 2 beepers on (1,0)
  - 2 beepers on (0,2)
  - 1 beeper on (3,2)


#TODO#
1. Change execution speed from within Karel
2. Change world from within Karel
3. Re-run commands from within Karel
4. Show Bugs within Karel rather than in console
