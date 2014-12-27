KOR
===

Karel in Cocos2d-js! 

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
