let seeded = false;
let state = 1;

export const setSeed = (s) => {
  if (typeof s !== 'number') {
    seeded = false;
    return;
  }
  seeded = true;
  state = s % 2147483647;
  if (state <= 0) state += 2147483646;
};

export const random = () => {
  if (!seeded) return Math.random();
  state = (state * 16807) % 2147483647;
  return (state - 1) / 2147483646;
};
