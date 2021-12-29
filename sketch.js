
// the snake is divided into small segments, which are drawn and edited on each 'draw' call
let numSegments = 10;
let direction = 'right';

const xStart = 190; //starting x coordinate for snake
const yStart = 250; //starting y coordinate for snake
const diff = 10;

let xCor = [];
let yCor = [];

let xFruit = 0;
let yFruit = 0;
let scoreElem;
let speed;
let font;
let snakelen;
let menuTextColor = 10;
let fontsize = 100;

let framerate = 1;
let gamestarted = false;

function preload() {
  font = loadFont('font/Pixeboy-z8XGD.ttf');
}

function setup() {
  textFont(font);
  textSize(fontsize);
  scoreElem = createDiv('Score = 0');
  speed = createDiv('Speed = ' + framerate);
  snakelen = createDiv('Length = ' + numSegments);
  scoreElem.position(20, 20);
  speed.position(20, 40);
  snakelen.position(20, 60);
  scoreElem.id = 'score';
  speed.id = 'speed';
  snakelen.id = 'len';
  scoreElem.style('color', 'white');
  speed.style('color', 'white');
  snakelen.style('color', 'white');
  scoreElem.hide();
  speed.hide();
  snakelen.hide();
  createCanvas(500, 500);
  for (let i = 0; i < numSegments; i++) {
    xCor.push(xStart + i * diff);
    yCor.push(yStart);
  }
}

function draw() {
  background(0);
  if (gamestarted == true) {
    frameRate(framerate);
    updateFruitCoordinates();
    scoreElem.show();
    speed.show();
    snakelen.show();
    for (let i = 0; i < numSegments - 1; i++) {
      line(xCor[i], yCor[i], xCor[i + 1], yCor[i + 1]);
    }
    if (keyIsPressed && key == 'e') {
      frameRate(framerate + 20);
    }
    else {
      frameRate(framerate);
    }
    speed.html('Speed = ' + framerate);
    snakelen.html('Length = ' + numSegments);
    updateSnakeCoordinates();
    checkGameStatus();
    checkForFruit();
  }
  else {
    let r = Math.floor(Math.random() * (255 - 0) + 0);
    let g = Math.floor(Math.random() * (255 - 0) + 0);
    let b = Math.floor(Math.random() * (255 - 0) + 0);
    fill(r, g, b);
    text('Snek', 150, 150);
    strokeWeight(10);
    stroke(r, g, b);
    frameRate(3);
    for (let i = 0; i < numSegments - 1; i++) {
      line(xCor[i], yCor[i], xCor[i + 1], yCor[i + 1]);
    }
    updateSnakeCoordinatesMenu();
  }
}

function updateSnakeCoordinatesMenu() {
  for (let i = 0; i < numSegments - 1; i++) {
    xCor[i] = xCor[i + 2];
    yCor[i] = yCor[i + 2];
  }
  let num = Math.floor(Math.random() * (4 - 1) + 1);
  switch (num) {
    case 1:
      xCor[numSegments - 2] = xCor[numSegments - 4] + diff;
      yCor[numSegments - 2] = yCor[numSegments - 4];
      break;
    case 2:
      xCor[numSegments - 2] = xCor[numSegments - 4];
      yCor[numSegments - 2] = yCor[numSegments - 4] - diff;
      break;
    case 3:
      xCor[numSegments - 2] = xCor[numSegments - 2] - diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 4:
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] + diff;
      break;
  }
}

/*
 The segments are updated based on the direction of the snake.
 All segments from 0 to n-1 are just copied over to 1 till n, i.e. segment 0
 gets the value of segment 1, segment 1 gets the value of segment 2, and so on,
 and this results in the movement of the snake.

 The last segment is added based on the direction in which the snake is going,
 if it's going left or right, the last segment's x coordinate is increased by a
 predefined value 'diff' than its second to last segment. And if it's going up
 or down, the segment's y coordinate is affected.
*/
function updateSnakeCoordinates() {
  for (let i = 0; i < numSegments - 1; i++) {
    xCor[i] = xCor[i + 1];
    yCor[i] = yCor[i + 1];
  }
  switch (direction) {
    case 'right':
      xCor[numSegments - 1] = xCor[numSegments - 2] + diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'up':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] - diff;
      break;
    case 'left':
      xCor[numSegments - 1] = xCor[numSegments - 2] - diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'down':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] + diff;
      break;
  }
}

/*
 I always check the snake's head position xCor[xCor.length - 1] and
 yCor[yCor.length - 1] to see if it touches the game's boundaries
 or if the snake hits itself.
*/
function checkGameStatus() {
  if (
    xCor[xCor.length - 1] > width ||
    xCor[xCor.length - 1] < 0 ||
    yCor[yCor.length - 1] > height ||
    yCor[yCor.length - 1] < 0 ||
    checkSnakeCollision()
  ) {
    noLoop();
    const scoreVal = parseInt(scoreElem.html().substring(8));
    scoreElem.html('Game ended! Your score was : ' + scoreVal);
  }
}

/*
 If the snake hits itself, that means the snake head's (x,y) coordinate
 has to be the same as one of its own segment's (x,y) coordinate.
*/
function checkSnakeCollision() {
  const snakeHeadX = xCor[xCor.length - 1];
  const snakeHeadY = yCor[yCor.length - 1];
  for (let i = 0; i < xCor.length - 1; i++) {
    if (xCor[i] === snakeHeadX && yCor[i] === snakeHeadY) {
      return true;
    }
  }
}

/*
 Whenever the snake consumes a fruit, I increment the number of segments,
 and just insert the tail segment again at the start of the array (basically
 I add the last segment again at the tail, thereby extending the tail)
*/
function checkForFruit() {
  point(xFruit, yFruit);
  if (xCor[xCor.length - 1] === xFruit && yCor[yCor.length - 1] === yFruit) {
    const prevScore = parseInt(scoreElem.html().substring(8));
    scoreElem.html('Score = ' + (prevScore + 1));
    xCor.unshift(xCor[0]);
    yCor.unshift(yCor[0]);
    numSegments++;
    framerate = framerate / 2;
    frameRate(framerate);
    updateFruitCoordinates();
  }
}

function updateFruitCoordinates() {
  /*
    The complex math logic is because I wanted the point to lie
    in between 100 and width-100, and be rounded off to the nearest
    number divisible by 10, since I move the snake in multiples of 10.
  */

  xFruit = floor(random(10, (width - 100) / 10)) * 10;
  yFruit = floor(random(10, (height - 100) / 10)) * 10;
}

function keyPressed() {
  switch (keyCode) {
    case 74:
      if (direction !== 'right') {
        direction = 'left';
        framerate++;
      }
      break;
    case 76:
      if (direction !== 'left') {
        direction = 'right';
        framerate++;
      }
      break;
    case 73:
      if (direction !== 'down') {
        direction = 'up';
        framerate++;
      }
      break;
    case 75:
      if (direction !== 'up') {
        direction = 'down';
        framerate++;
      }
      break;

  }
}
