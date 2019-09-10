const nonogram = new Nonogram();

function setup() {
  const data = random_nonogram(50, 0.7);
  nonogram.setup(
    data.width,
    data.height,
    data.col_hints,
    data.row_hints
  );
  createCanvas(constants.CV_W, constants.CV_H);
  nonogram.draw();
}

function draw() {
  // put drawing code here
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    nonogram.solveStep();
    nonogram.draw();
  }
}
