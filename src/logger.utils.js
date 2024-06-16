var utils = {
  /** @param {string} str */
  capitalize: function (str) {
    if (str.length == 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
};

module.exports = utils;
