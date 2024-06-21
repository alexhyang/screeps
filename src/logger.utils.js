/**
 * @param {string} str
 * @returns {string} capitalized string of the given string
 */
const capitalize = (str) => {
  if (str.length == 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
/**
 * @param {number} num
 * @param {number} numOfDecimalPlaces
 * @returns {number} the given number in thousands
 */
const convertNumToThousands = (num, numOfDecimalPlaces) => {
  return roundTo(num / 1000, numOfDecimalPlaces);
};
/**
 * @param {number} num
 * @param {number} numOfDecimalPlaces
 * @returns {number} the given number in millions
 */
const convertNumToMillions = (num, numOfDecimalPlaces) => {
  return roundTo(num / 1000000, numOfDecimalPlaces);
};
/**
 * @param {number} num
 * @param {number} numOfDecimalPlaces
 * @returns {number} the given number rounded to given number of decimal
 * places
 */
const roundTo = (num, numOfDecimalPlaces) => {
  let multiplier = Math.pow(10, numOfDecimalPlaces);
  return Math.round(num * multiplier) / multiplier;
};

/**
 *
 * @param {number} number
 * @returns {string} progress in text form with units "K", "M"
 */
const parseNumber = (number) => {
  if (number >= 1000000) {
    return convertNumToMillions(number, 2) + "M";
  } else if (number >= 1000) {
    return convertNumToThousands(number, 2) + "K";
  } else {
    return number;
  }
};

module.exports = {
  capitalize,
  convertNumToThousands,
  convertNumToMillions,
  roundTo,
  parseNumber,
};
