export function percentile(_arr, percentage) {
  const sortedArray = [..._arr];
  sortedArray.sort();
  if (sortedArray.length === 0) return 0;
  if (typeof percentage !== 'number') throw new TypeError('p must be a number');
  if (percentage <= 0) return sortedArray[0];
  if (percentage >= 1) return sortedArray[sortedArray.length - 1];

  const index = (sortedArray.length - 1) * percentage,
    lower = Math.floor(index),
    upper = lower + 1,
    weight = index % 1;

  if (upper >= sortedArray.length) return sortedArray[lower];
  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}

export const probabilityLessThan = (numbers, value) => {
  const totalUnderValue = numbers.filter(n => n <= value);
  return Number((totalUnderValue.length / numbers.length).toFixed(2));
};

export const probabilityMoreThan = (numbers, value) => {
  const totalUnderValue = numbers.filter(n => n >= value);
  return Number((totalUnderValue.length / numbers.length).toFixed(2));
};

export const probabilityBetween = (numbers, {from, to}) => {
  const totalBetween = numbers.filter(n => from <= n && n <= to);
  return Number((totalBetween.length / numbers.length).toFixed(2));
};
