var squadLogger = require("logger.squad");

var logger = {
  log: function () {
    squadLogger.log();
  },
};

module.exports = logger;
