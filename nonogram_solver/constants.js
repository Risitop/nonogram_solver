const constants = {
  'UNSEEN': -2,
  'UNKNOWN': -1,
  'EMPTY': 0,
  'FULL': 1,

  'CV_W': 800,
  'CV_H': 800,
  'GRID_W': 600,
  'GRID_H': 600,

  'NB_STEP': 12,
  'NB_SIZE': 12,

  'HINT_C': 0,
  'HINT_R': 1,

  'ERR_OOB': 'Index out of bounds.',
  'ERR_SET_ROW': 'Rows sizes do not match',
  'ERR_SET_COL': 'Cols sizes do not match',
  'ERR_CHINTS_SIZE': 'Incompatible size for columns hints.',
  'ERR_RHINTS_SIZE': 'Incompatible size for rows hints.'
}

const samurai = {
  'width': 15,
  'height': 15,
  'row_hints': [
    [5,1,1],
    [8,1],
    [1,5,1],
    [1,1,4,1],
    [1,2,4,1],
    [1,4,2],
    [4,4,3],
    [9,3],
    [2,4,4],
    [2,2,3],
    [2,2,3],
    [3,2,5],
    [5,7],
    [1,1,5],
    [1,1,1]
  ],
  'col_hints': [
    [1,3],
    [6,1],
    [6,2],
    [2,2,1],
    [2,1,1,1],
    [2,2,1,3],
    [3,3,2],
    [12],
    [11,1],
    [8,1],
    [6,4],
    [6],
    [8],
    [15],
    [4,3]
  ]
}
