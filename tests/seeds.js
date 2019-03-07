const arr = [
  {b: 23230},
  {a: 'a1', b: 23231},
  {a: 'a2', b: 23232},
  {a: 'a2', b: 23232},
  {a: 'a3', b: 23233},
  {a: 'a4', b: 23234},
];

const src = {
  a: {
    b: {
      c: [1, 2, 3],
      d: {
        e: '234',
      },
    },
  },
};

const dst = {
  a: {
    b: {
      c: [1, 2, 3],
      d: {
        e: '234',
      },
    },
  },
  insertedProp: {
    c: [1, 2, 3],
    d: {
      e: '234',
    },
  },
};

const dst2 = {
  a: {
    b: {
      c: [1, 2, 3],
      d: {
        e: '234',
        insertedProp: {
          c: [1, 2, 3],
          d: {
            e: '234',
          },
        },
      },
    },
  },
};

const bSrc = {
  c: [1, 2, 3],
  d: {
    e: '234',
  },
};

module.exports = {
  arr,
  src,
  dst,
  dst2,
  bSrc
}