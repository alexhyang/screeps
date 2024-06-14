var squadLogger = require("./logger.squad");
const { ENERGY_AVAILABLE, ENERGY_CAPACITY_AVAILABLE } = require("./dashboard");

var logger = {
  log: function () {
    console.log("-------------------------------");
    console.log(`Energy: ${ENERGY_AVAILABLE}/${ENERGY_CAPACITY_AVAILABLE}`);
    squadLogger.log();
    console.log("\n");
  },
};

module.exports = logger;
