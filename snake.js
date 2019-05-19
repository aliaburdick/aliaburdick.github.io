
var draw = function(snakeToDraw, apple) {
  var drawableSnake = { color: "green", pixels: snakeToDraw };
  var drawableApple = { color: "red", pixels: [apple] };
  var drawableObjects = [drawableSnake, drawableApple];
  CHUNK.draw(drawableObjects);
}

var moveSegment = function(segment) {
  switch (segment.direction) {
    case "down":
      return { top: segment.top + 1, left: segment.left };
    case "up":
      return { top: segment.top - 1, left: segment.left };
    case "right":
      return { top: segment.top, left: segment.left + 1 };
    case "left":
      return { top: segment.top, left: segment.left - 1 };
    default:
      return segment;
  }
}

var segmentFurtherForwardThan = function(index,snake){
  if (snake[index - 1] === undefined) {
    return snake[index];
  } else {
    return snake[index - 1]
  }
}

var moveSnake = function(snake) {
  return snake.map(function(oldSegment, segmentIndex) {
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
    return newSegment;
  });
}

var growSnake = function(snake) {
  var indexOfLastSegment = snake.length - 1;
  var lastSegment = snake[indexOfLastSegment];
  snake.push({ top: lastSegment.top, left: lastSegment.left });
  return snake;
}

// this function allows detection of collision between the snake and something else
// could be the game boundary, apple, itself, or any other item instantiated
var ate = function(snake, otherThing) {
  // this function takes in two parameters: snake and something else
  var head = snake[0];
  // the variable head = the item of array of snake at index 0
  return CHUNK.detectCollisionBetween([head], otherThing);
  // calls function from Chunk to detect collision between head and the other thing that's passed in
}


// this function allows the game to iterate over and play itself
var advanceGame = function() {
  var newSnake = moveSnake(snake);

  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Don't be a dummy. You ate yourself");
  }
  if (ate(newSnake, [apple])){
    newSnake = growSnake(newSnake);
    apple = CHUNK.randomLocation();
  }
  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Game Over! You Suck!");
  }

  snake = newSnake;
  draw(snake, apple);
}

var changeDirection = function(direction) {
  snake[0].direction = direction;
}

var snake = [{ top:1, left:0, direction: "down"}, { top:0, left:0, direction: "down"}];
var apple = { top: 8, left: 10};
CHUNK.executeNTimesPerSecond(advanceGame, 1);
CHUNK.onArrowKey(changeDirection);
