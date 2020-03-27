export const getRandomInt = (min, max) => (
  Math.floor(Math.random() * (max - min) + min)
);

export const doProbability = () => (
  Math.random() < 0.1
);
