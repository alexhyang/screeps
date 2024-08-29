/**
 * Set debugCountdown to given time and start debug mode
 * @param {number} time
 */
const startDebug = (time) => {
  Memory.debugCountDown = time;
};

module.exports = {
  startDebug,
};
