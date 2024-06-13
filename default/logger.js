var squadLogger = require("logger.squad");
const resourceLogger = require("logger.resource");

var logger = {
  log: function () {
    resourceLogger.log();
    squadLogger.log();
    console.log("\n");
  },
};

module.exports = logger;
