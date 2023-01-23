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

export const addZeros = (number: number | string, length = 2) => {
  const _number = String(number);

  if (_number.length >= length) return _number;

  const zeros = Array(length - _number.length).fill("0").join("");
  return zeros + _number;
};
