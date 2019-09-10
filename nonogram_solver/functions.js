function sum(array) {
  let ct = 0;
  for (let a of array) { ct += a; }
  return ct;
}

function random_nonogram(w, p) {

  const array  = new Array();
  for (let i=0; i < w; i++) {
    const tmp = new Array();
    for (let j=0; j < w; j++) {
      tmp.push( (random() < p) ? 1 : 0 );
    }
    array.push(tmp);
  }

  const row_hints = new Array();
  for (let i=0; i < w; i++) {
    const hint = new Array();
    let ct = 0;
    for (let j=0; j<w; j++) {
      switch (array[i][j]) {
        case 1:
          ct += 1
          break;
        case 0:
          if (ct > 0) {
            hint.push(ct);
            ct = 0;
          }
      }
    }
    if (ct > 0) hint.push(ct);
    if (hint.length == 0) hint.push(0);
    row_hints.push(hint)
  }

  const col_hints = new Array();
  for (let i=0; i < w; i++) {
    const hint = new Array();
    let ct = 0;
    for (let j=0; j<w; j++) {
      switch (array[j][i]) {
        case 1:
          ct += 1
          break;
        case 0:
          if (ct > 0) {
            hint.push(ct);
            ct = 0;
          }
      }
    }
    if (ct > 0) hint.push(ct);
    if (hint.length == 0) hint.push(0);
    col_hints.push(hint)
  }

  return {
    'width': w,
    'height': w,
    'row_hints': row_hints,
    'col_hints': col_hints
  }
}
