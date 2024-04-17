const cellSpeed = 1.2;
const cellLifetime = 60000;
const quarkSize = 4;
const mitosisThresholdRatio = 4;
const endingGeneration = 10;
let cells = [];
let factionColors

let factionCount = 1;
let mitosisThreshold = quarkSize * mitosisThresholdRatio;


// Constant time array element removal
Array.prototype.deref = function arrayDeref(i) {
  this[i] = this[this.length - 1];
  this[i].updateIndex(i);
  this.pop();
}


// Fast distance computation
// Skips determining the squareroot and accepts vector objects
function quickDist(pos1, pos2) {
  let x = sq(pos2.x - pos1.x);
  let y = sq(pos2.y - pos1.y);
  return abs(x + y);
}


// Returns the vector offset between two Cells scaled by the ratio of their sizes
function distRatio(cell1, cell2) {
  let sizeDiff = cell1.size - cell2.size;
  let sizeSign = sizeDiff / abs(sizeDiff);
  let unitOffset = cell2.position.copy().sub(cell1.position).limit(cell2.size);
  return(unitOffset.mult(sizeSign));
}


// Returns the average of two numbers
function average(num1, num2) {
  return (num1 + num2) / 2;
}


// Called when thegram starts
function setup() {
  factionColors = [
    color(255, 0, 0),
    color(80, 200, 50),
    color(0, 150, 250),
    color(250, 200, 50),
    color(220, 80, 250),
    color(50, 50, 100)
  ];
  factionCount = factionColors.length;
  
  createCanvas(400, 400);
  noStroke();
}


// Draws every frame
function draw() {
  background(220);
  translate(width/2, height/2);
  
  for (let c = 0; c < cells.length; c++) {
    cells[c].process();
  }
}


// User input
function mouseClicked() {
  spawnCell(createVector(mouseX - width/2, mouseY - height/2));
}


// Spawns a new cell entity at the given position
function spawnCell(position) {
  cells.push(new Cell(cells.length, position, 0, quarkSize * (random() + 1), 0));
}