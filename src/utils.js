/**
 * Examine the given object
 * @param {Object} object
 */
function checkObject(object) {
  console.log("checking object...");
  console.log("Object:", object);
  console.log("Object type:", typeof object);
  console.log("Object keys:", Object.keys(object));
  console.log("Object property example:", object[0]);
}

/**
 * Capitalize a string
 * @param {string} str string
 * @returns {string} capitalized string
 */
const capitalize = (str) => {
  if (str.length == 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Pad given string to a given length
 * @param {string} str string to be padded
 * @param {number} maxLength max length after padding
 * @returns Padded string with the given max length
 */
const padStr = (str, maxLength, padding = " ") => {
  return str + padding.repeat(maxLength - str.length);
};

/**
 * Convert a number to thousands (i.e. 1200 -> 1.2)
 * @param {number} num
 * @param {number} numOfDecimalPlaces
 * @returns {number} the given number in thousands
 */
const convertNumToThousands = (num, numOfDecimalPlaces) => {
  return roundTo(num / 1000, numOfDecimalPlaces);
};

/**
 * Convert a number to millions (i.e. 1,200,000 -> 1.2)
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
  checkObject,
  capitalize,
  padStr,
  roundTo,
  parseNumber,
};
