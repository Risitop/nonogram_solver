class Grid {
  constructor(w, h) {
    this.w  = w;
    this.h  = h;
    this.array  = new Array();
    for (let i=0; i < this.width; i++) {
      const tmp = new Array();
      for (let j=0; j < this.height; j++) {
        tmp.push(constants.UNKNOWN);
      }
      this.array.push(tmp);
    }
  }

  get width()  { return this.w; }
  get height() { return this.h; }

  pixel(i, j) {
      console.assert( i>=0 && i<this.width,  constants.ERR_OOB );
      console.assert( j>=0 && j<this.height, constants.ERR_OOB );
      return this.array[i][j];
  }

  set_pixel(i, j, v) {
    console.assert( i>=0 && i<this.width,  constants.ERR_OOB );
    console.assert( j>=0 && j<this.height, constants.ERR_OOB );
    this.array[i][j] = v;
  }

  row(j) {
    const row = new Array();
    for (let k=0; k < this.width; k++) {
      row.push(this.array[k][j])
    }
    return row;
  }

  update_row(j, v) {
    console.assert( j>=0 && j<this.height, constants.ERR_OOB );
    console.assert( v.length == this.row(j).length, constants.ERR_SET_ROW );
    for (let k=0; k < this.width; k++) {
      this.array[k][j] = v[k];
    }
  }

  col(i) {
    return Array.from(this.array[i])
  }

  update_col(i, v) {
    console.assert( i>=0 && i<this.width, constants.ERR_OOB );
    console.assert( v.length == this.col(i).length, constants.ERR_SET_ROW );
    for (let k=0; k < this.width; k++) {
      this.array[i][k] = v[k];
    }
  }
}

class Nonogram {
  constructor() {
    this.grid = null;
    this.c_hints = null;
    this.r_hints = null;
  }

  setup(w, h, c_hints, r_hints) {
    this.grid = new Grid(w, h);

    console.assert(c_hints.length == this.width,  console.ERR_CHINTS_SIZE);
    this.c_hints = c_hints;
    console.assert(r_hints.length == this.height, console.ERR_RHINTS_SIZE);
    this.r_hints = r_hints;
  }

  get width()  { return this.grid.h; }
  get height() { return this.grid.w; }

  pixel(i, j) {
    return this.grid.pixel(i, j);
  }

  hints(colrow, i) {
    switch (colrow) {
      case constants.HINT_C: // column mode
        console.assert( i <= this.width, constants.ERR_OOB );
        return Array.from(this.c_hints[i]);
      default:
        console.assert( i <= this.height, constants.ERR_OOB );
        return Array.from(this.r_hints[i]);
    }
  }

  matches(vec, hints) { // Partial match
    return false;
  }

  coincidate(vec, hints, hints_gaps) {
    if (sum(hints_gaps) + sum(hints) > vec.length) return false;
    let pos = 0;
    for (let i=0; i < hints.length; i++) {
      const gap = hints_gaps[i];
      for (let j=0; j < gap; j++) {
        if (vec[pos] == constants.FULL) return false;
        pos += 1;
      }
      const size = hints[i];
      for (let j=0; j < size; j++) {
        if (vec[pos] == constants.EMPTY) return false;
        pos += 1;
      }
    }
    while (pos < vec.length) {
      if (vec[pos] == constants.FULL) return false;
      pos += 1;
    }
    return true;
  }

  update_vec(vec, hints) {

    const new_vec = new Array(); // New state of the line, a priori full
    for (let i=0; i < vec.length; i++) { new_vec.push(constants.UNSEEN); }

    const hints_gaps = [0]; // Hypothetical spacings
    for (let i=0; i < hints.length - 1; i++) { hints_gaps.push(1); }

    while (true) {
      // We check if current gaps are coherent with known squares
      if (this.coincidate(vec, hints, hints_gaps)) {
        // If yes, we update the line
        let pos = 0;
        for (let i=0; i < hints.length; i++) {
          const gap = hints_gaps[i];
          for (let j=0; j < gap; j++) {
            if (new_vec[pos] == constants.UNSEEN) {
              new_vec[pos] = constants.EMPTY;
            } else if (new_vec[pos] == constants.FULL) {
              new_vec[pos] = constants.UNKNOWN;
            }
            pos += 1;
          }
          const size = hints[i];
          for (let j=0; j < size; j++) {
            if (new_vec[pos] == constants.UNSEEN) {
              new_vec[pos] = constants.FULL;
            } else if (new_vec[pos] == constants.EMPTY) {
              new_vec[pos] = constants.UNKNOWN;
            }
            pos += 1;
          }
        }
        while (pos < vec.length) {
          if (new_vec[pos] == constants.UNSEEN) {
            new_vec[pos] = constants.EMPTY;
          } else if (new_vec[pos] == constants.FULL) {
            new_vec[pos] = constants.UNKNOWN;
          }
          pos += 1;
        }
      }
      // We update the gaps
      hints_gaps[hints.length - 1] += 1;
      let c_gap = hints.length - 1;
      while (sum(hints_gaps) + sum(hints) > vec.length) {
        if (c_gap == 0) return new_vec;
        hints_gaps[c_gap] = 1;
        hints_gaps[c_gap - 1] += 1;
        c_gap -= 1;
      }
    }
  }

  solveStep() {

    for (let i=0; i < this.width; i++) {
      const v = this.update_vec(this.grid.col(i), this.hints(constants.HINT_C, i));
      this.grid.update_col(i, v);
    }

    for (let j=0; j < this.width; j++) {
      const v = this.update_vec(this.grid.row(j), this.hints(constants.HINT_R, j));
      this.grid.update_row(j, v);
    }



  }

  draw() {
    textAlign(CENTER);
    textSize(constants.NB_SIZE);
    strokeWeight(4);
    stroke(0);
    fill(200);
    rect(0, 0, constants.CV_W - 1, constants.CV_H - 1);
    const dx = constants.CV_W - constants.GRID_W;
    const dy = constants.CV_H - constants.GRID_H;
    fill(100);
    rect(0, 0, dx, dy);
    fill(255);
    rect(dx, dy, constants.CV_W - dx - 1, constants.CV_H - dy - 1);

    const stepx = constants.GRID_W / this.width;
    const stepy = constants.GRID_H / this.height;

    // Grid
    strokeWeight(2);
    stroke(0);
    for (let i=0; i < this.width; i++) {
      for (let j=0; j < this.height; j++) {
        const v = this.pixel(i, j);
        const c = (
          v == constants.UNKNOWN ? 255 : ((v == constants.EMPTY) ? 200 : constants.FULL)
        )
        fill(c);
        rect(
          dx + i*stepx,
          dy + j*stepy,
          stepx,
          stepy
        )
      }
    }

    // H lines, row digits
    for (let i=0; i < this.width; i++) {
      if (i%5 == 0) { strokeWeight(4); }
      else { strokeWeight(2); }
      line(0, dy + i*stepx, constants.CV_W, dy + i*stepx);
      // Digits
      fill(0);
      noStroke();
      const ns = this.c_hints[i];
      for (let j=0; j < ns.length; j++) {
        text(ns[ns.length - j - 1], dx + stepx*(i+.5), dy - constants.NB_STEP*j - 10);
      }
      stroke(0);
      fill(255);
    }
    // W lines
    for (let i=0; i < this.height; i++) {
      if (i%5 == 0) { strokeWeight(4); }
      else { strokeWeight(2); }
      line(dx + i*stepy, 0, dx + i*stepy, dy + constants.GRID_H);
      // Digits
      fill(0);
      noStroke();
      const ns = this.r_hints[i];
      for (let j=0; j < ns.length; j++) {
        text(ns[ns.length - j - 1], dx - constants.NB_STEP*j - 30, dx + stepx*(i+.5) + 5);
      }
      stroke(0);
      fill(255);
    }
    strokeWeight(4);
    noFill();
    rect(0, 0, constants.CV_W - 1, constants.CV_H - 1);
  }
}
