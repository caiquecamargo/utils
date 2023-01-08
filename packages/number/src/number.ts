export const round = (value: number, precision = 0) => {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
};

export const between = (value: number, min: number, max: number) => {
  return value >= min && value <= max;
};

export const decompose = (number?: number): number[] => {
  if (number === null || number === undefined) return [];

  return String(number)
    .split("")
    .map((digit) => parseInt(digit, 10));
};
