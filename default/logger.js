var squadLogger = require("./logger.squad");
const resourceLogger = require("./logger.resource");

var logger = {
  log: function () {
    console.log("-------------------------------");
    resourceLogger.log();
    squadLogger.log();
    console.log("\n");
  },
};

module.exports = logger;
