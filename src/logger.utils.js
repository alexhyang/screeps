var utils = {
  /**
   * @param {string} str
   * @returns {string} capitalized string of the given string
   */
  capitalize: function (str) {
    if (str.length == 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  /**
   * @param {number} num
   * @param {number} numOfDecimalPlaces
   * @returns {number} the given number in thousands
   */
  convertNumToThousands: function (num, numOfDecimalPlaces) {
    return this.roundTo(num / 1000, numOfDecimalPlaces);
  },
  /**
   * @param {number} num
   * @param {number} numOfDecimalPlaces
   * @returns {number} the given number in millions
   */
  convertNumToMillions: function (num, numOfDecimalPlaces) {
    return this.roundTo(num / 1000000, numOfDecimalPlaces);
  },
  /**
   * @param {number} num
   * @param {number} numOfDecimalPlaces
   * @returns {number} the given number rounded to given number of decimal
   * places
   */
  roundTo: function (num, numOfDecimalPlaces) {
    let multiplier = Math.pow(10, numOfDecimalPlaces);
    return Math.round(num * multiplier) / multiplier;
  },
};

module.exports = utils;
